import { useEffect } from "react";

export default function useEmitReadReceipts({ messages, authUserId, updateMessageReadStatus, socket }) {
    useEffect(() => {

        if (!messages.length || !authUserId || !socket?.connected) {
            return
        }

        try {
            // 1. Identify messages sent to me that I haven't yet read
            const unreadMessages = messages.filter((msg) => {
                const isForMe = msg.receiverId === authUserId;
                const alreadyReadByMe = msg.readBy?.some((readEntry) =>
                    readEntry.userId === authUserId
                );
                return isForMe && !alreadyReadByMe;
            });

            if (unreadMessages.length === 0) return;

            // 2. Create a simplified array of message IDs
            const messageIds = unreadMessages.map(msg => msg._id);

            // 3. Update local state first
            messageIds.forEach((id) => {
                const timestamp = new Date().toISOString();
                updateMessageReadStatus(id, authUserId, timestamp);
            });

            // 4. Send only necessary data to server
            const payload = {
                messageIds,
                readerId: authUserId,
                readAt: new Date().toISOString()
            };

            // 5. Emit the simplified payload
            socket.emit("message_read", payload);
            console.log(payload)



        } catch (error) {
            console.error('Error in useEmitReadReceipts:', error);
        }
    }, [messages, authUserId, socket, updateMessageReadStatus]);
}