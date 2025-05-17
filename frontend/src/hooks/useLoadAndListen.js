import { useEffect } from "react";

export default function useLoadAndListen(selectedUser, loadChatHistory, listenForIncomingMessages, stopListeningForMessages) {
    useEffect(() => {
        loadChatHistory(selectedUser._id)
        listenForIncomingMessages()
        return () => stopListeningForMessages()
    }, [selectedUser, loadChatHistory, listenForIncomingMessages, stopListeningForMessages])
}