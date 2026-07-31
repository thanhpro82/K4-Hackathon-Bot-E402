class StuckRadar:
    """
    Proactive Stuck Radar & Quiet Ticket Generator cho Trợ Lý Discord.
    Giúp 90% học viên thầm lặng tháo gỡ kẹt bài mà không bị ngượng.
    """
    
    GATE_CHECKLISTS = {
        "gate1": {
            "title": "Gate 1 - Chốt Đề Tài & Canvas",
            "checklist": [
                "1. Bạn đã chốt Lát cắt MỘT CÂU (1 user, 1 việc, 1 quyết định AI, 1 kết quả) chưa?",
                "2. Bạn đã có con số định lượng từ 5,898 tin nhắn Discord chưa?",
                "3. Nhóm đã phân công tên cụ thể cho từng thành viên trong README.md chưa?"
            ]
        },
        "gate2": {
            "title": "Gate 2 - Prototype Sketch / Mock",
            "checklist": [
                "1. Flow chính của prototype bấm từ đầu đến cuối được chưa?",
                "2. Đã commit mã nguồn đầu tiên lên GitHub Repo P-XXX chưa?",
                "3. Đã xác định rõ phần nào mock, phần nào gọi AI thật chưa?"
            ]
        },
        "gate3": {
            "title": "Gate 3 - AI Gọi Thật & Eval Lượt 1",
            "checklist": [
                "1. Đã có ít nhất 1 cuộc gọi API AI thật ở quyết định trung tâm chưa?",
                "2. Bộ Golden Set đã đủ >= 20 cases phủ 4 lớp chỗ khó chưa?",
                "3. Đã có bảng kết quả đo % Grounded Rate lượt 1 chưa?"
            ]
        }
    }

    def get_stuck_checklist(self, gate_name="gate1"):
        gate_info = self.GATE_CHECKLISTS.get(gate_name.lower(), self.GATE_CHECKLISTS["gate1"])
        msg = [f"🛠️ **CHECKLIST THÁO KẸT DÀNH CHO {gate_info['title'].upper()}**\n"]
        for step in gate_info["checklist"]:
            msg.append(f"  └ {step}")
            
        msg.append("\n👉 *Nếu bạn vẫn bị kẹt, hãy gõ `/stuck-esc` để gửi Quiet Ticket cho TA phụ trách nhóm mà không cần đăng công khai!*")
        return "\n".join(msg)

    def generate_quiet_ticket(self, user_name, team_id, issue_description):
        return {
            "ticket_id": f"QT-{team_id}-001",
            "status": "CREATED_PRIVATELY",
            "message": f"🎟️ **Quiet Ticket {team_id} đã được gửi riêng cho @TA-Support!**\nHọc viên: `{user_name}`\nVấn đề: `{issue_description}`\n*(Thông tin được bảo mật, TA sẽ nhắn tin hỗ trợ riêng cho nhóm)*"
        }

if __name__ == "__main__":
    radar = StuckRadar()
    print(radar.get_stuck_checklist("gate1"))
