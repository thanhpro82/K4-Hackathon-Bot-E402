import os
import re
import sys
import json
import pandas as pd
from datetime import datetime
from collections import Counter

# Set stdout/stderr encoding to utf-8 for Windows console
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

DATA_DIR = r"d:\VIN_AITC\LAB\AI-Product-Hackathon\data"
OUTPUT_JSON = r"d:\VIN_AITC\LAB\AI-Product-Hackathon\data\processed_discord_messages.json"
OUTPUT_CSV = r"d:\VIN_AITC\LAB\AI-Product-Hackathon\data\processed_discord_messages.csv"
SUMMARY_JSON = r"d:\VIN_AITC\LAB\AI-Product-Hackathon\data\discord_mining_summary.json"

# Regex patterns
HEADER_CHANNEL_RE = re.compile(r"^Channel:\s*(.+)$", re.MULTILINE)
MSG_HEADER_RE = re.compile(r"^\[(\d{1,2}/\d{1,2}/\d{4}\s+\d{1,2}:\d{2}\s+(?:AM|PM))\]\s+(.+)$")

# Keywords for Intent Heuristics
GREETING_KEYWORDS = ["xin chào", "hello", "hi", "chào", "good day", "ciao", "ni hao", "bon soir", "hé lố", "helo", "hế lô", "gút chóp", "chào cả nhà"]
LOGISTICS_KEYWORDS = ["deadline", "hạn nộp", "link", "nộp bài", "lịch", "slide", "recording", "kênh", "role", "ticket", "dấu", "quy định", "hướng dẫn", "mấy giờ", "khi nào", "ở đâu"]
TECH_KEYWORDS = ["lỗi", "error", "bug", "code", "run", "python", "colab", "api", "key", "import", "install", "failed", "traceback", "exception", "model", "prompt", "rag", "git", "repo", "commit", "push"]
COMMAND_KEYWORDS = ["!check", "/submit", "!help", "!point", "!rank", "!info"]

def parse_discord_txt(filepath):
    filename = os.path.basename(filepath)
    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
        lines = f.readlines()

    channel_name = filename
    # Check header
    for line in lines[:10]:
        m = HEADER_CHANNEL_RE.match(line.strip())
        if m:
            channel_name = m.group(1).strip()
            break

    messages = []
    current_msg = None

    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.rstrip("\r\n")

        # Check if line matches message header [M/D/YYYY H:MM AM/PM] username
        m = MSG_HEADER_RE.match(stripped)
        if m:
            if current_msg:
                # Save previous message
                current_msg["content"] = "\n".join(current_msg["content_lines"]).strip()
                messages.append(current_msg)
            
            timestamp_str, author = m.groups()
            current_msg = {
                "source_file": filename,
                "channel": channel_name,
                "timestamp_str": timestamp_str,
                "author": author.strip(),
                "content_lines": [],
                "attachments": [],
                "reactions": [],
            }
            i += 1
            continue

        if current_msg is not None:
            if stripped == "{Attachments}":
                i += 1
                while i < len(lines) and lines[i].strip() and not lines[i].startswith("[") and lines[i].strip() != "{Reactions}":
                    current_msg["attachments"].append(lines[i].strip())
                    i += 1
                continue
            elif stripped == "{Reactions}":
                i += 1
                while i < len(lines) and lines[i].strip() and not lines[i].startswith("["):
                    current_msg["reactions"].append(lines[i].strip())
                    i += 1
                continue
            else:
                current_msg["content_lines"].append(stripped)

        i += 1

    if current_msg:
        current_msg["content"] = "\n".join(current_msg["content_lines"]).strip()
        messages.append(current_msg)

    # Post-process messages
    processed = []
    for idx, msg in enumerate(messages):
        content = msg["content"]
        content_lower = content.lower()
        author = msg["author"]

        # Clean fields
        del msg["content_lines"]

        # Meta flags
        is_bot = bool(re.search(r"(bot|trợ lý|assistant|kute)", author, re.IGNORECASE))
        has_code_block = "```" in content
        has_mention = "@" in content
        has_attachment = len(msg["attachments"]) > 0

        # Heuristic Intent Classification
        intent = "general"
        if any(cmd in content_lower for cmd in COMMAND_KEYWORDS) or content_lower.startswith("!") or content_lower.startswith("/"):
            intent = "command"
        elif any(g in content_lower for g in GREETING_KEYWORDS) and len(content) < 30:
            intent = "greeting"
        elif any(t in content_lower for t in TECH_KEYWORDS) or has_code_block:
            intent = "technical_question"
        elif any(l in content_lower for l in LOGISTICS_KEYWORDS) or "?" in content:
            intent = "logistics_question"
        
        msg["id"] = f"{idx}_{filename[:10]}"
        msg["is_bot"] = is_bot
        msg["has_code_block"] = has_code_block
        msg["has_mention"] = has_mention
        msg["has_attachment"] = has_attachment
        msg["intent_heuristic"] = intent
        msg["char_length"] = len(content)

        processed.append(msg)

    return processed

def run_pipeline():
    all_messages = []
    txt_files = [f for f in os.listdir(DATA_DIR) if f.endswith(".txt")]
    
    print(f"Found {len(txt_files)} txt files in {DATA_DIR}")
    for filename in txt_files:
        filepath = os.path.join(DATA_DIR, filename)
        msgs = parse_discord_txt(filepath)
        print(f"  Parsed {len(msgs)} messages from file: {filename[:30]}...")
        all_messages.extend(msgs)

    print(f"\nTotal messages parsed: {len(all_messages)}")

    # Save to JSON
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(all_messages, f, ensure_ascii=False, indent=2)
    print(f"Saved processed JSON to {OUTPUT_JSON}")

    # Save to CSV
    df = pd.DataFrame(all_messages)
    # Convert lists to str for CSV
    df["attachments"] = df["attachments"].apply(lambda x: " | ".join(x) if isinstance(x, list) else "")
    df["reactions"] = df["reactions"].apply(lambda x: " | ".join(x) if isinstance(x, list) else "")
    df.to_csv(OUTPUT_CSV, index=False, encoding="utf-8-sig")
    print(f"Saved processed CSV to {OUTPUT_CSV}")

    # Aggregations & Mining Summary
    total_msgs = len(df)
    non_bot_df = df[~df["is_bot"]]
    bot_df = df[df["is_bot"]]

    intent_counts = {str(k): int(v) for k, v in df["intent_heuristic"].value_counts().items()}
    channel_counts = {str(k): int(v) for k, v in df["channel"].value_counts().items()}
    author_counts = {str(k): int(v) for k, v in non_bot_df["author"].value_counts().head(15).items()}
    
    # Stuck student detection heuristic: non-bot users with multiple technical/logistics questions
    tech_users = non_bot_df[non_bot_df["intent_heuristic"].isin(["technical_question", "logistics_question"])]
    user_question_counts = {str(k): int(v) for k, v in tech_users["author"].value_counts().head(10).items()}

    # Sample verbatim questions for evidence (Tiêu chí 2)
    logistics_samples = non_bot_df[non_bot_df["intent_heuristic"] == "logistics_question"]["content"].dropna().head(10).tolist()
    tech_samples = non_bot_df[non_bot_df["intent_heuristic"] == "technical_question"]["content"].dropna().head(10).tolist()

    summary = {
        "total_messages": total_msgs,
        "human_messages_count": len(non_bot_df),
        "bot_messages_count": len(bot_df),
        "intent_breakdown": intent_counts,
        "channel_breakdown": channel_counts,
        "top_active_students": author_counts,
        "top_questioning_students": user_question_counts,
        "verbatim_samples": {
            "logistics_questions": logistics_samples,
            "technical_questions": tech_samples
        }
    }

    with open(SUMMARY_JSON, "w", encoding="utf-8") as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)
    print(f"Saved mining summary to {SUMMARY_JSON}")

    # Print Report
    print("\n" + "="*50)
    print("      DISCORD MINING SUMMARY REPORT")
    print("="*50)
    print(f"Total Messages Processed: {total_msgs}")
    print(f"Human Messages: {len(non_bot_df)} | Bot Messages: {len(bot_df)}")
    print("\nIntent Breakdown:")
    for k, v in intent_counts.items():
        print(f"  - {k}: {v} ({v/total_msgs*100:.1f}%)")
    
    print("\nTop Channels:")
    for k, v in channel_counts.items():
        print(f"  - {k}: {v}")

    print("\nSample Logistics Questions:")
    for i, s in enumerate(logistics_samples[:5], 1):
        clean_s = s.replace("\n", " ")
        print(f"  {i}. {clean_s[:100]}...")

    print("\nSample Technical Questions:")
    for i, s in enumerate(tech_samples[:5], 1):
        clean_s = s.replace("\n", " ")
        print(f"  {i}. {clean_s[:100]}...")

if __name__ == "__main__":
    run_pipeline()
