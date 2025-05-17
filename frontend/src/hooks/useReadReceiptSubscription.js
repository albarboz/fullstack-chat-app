import { useEffect } from "react";

export default function useReadReceiptSubscription(
    onMessageReadUpdate,
    offMessageReadUpdate,
    updateMessageReadStatus
) {
    useEffect(() => {
        // 1. Define a handler for when a server notifies us a message was read
        function handleReadUpdate({ messageId, readerId, readAt}) {
            updateMessageReadStatus(messageId, readerId, readAt)
        }

        // 2. Register the handler
        onMessageReadUpdate(handleReadUpdate)
                
        // 3. Clean up when the component unmounts or dependencies change 
        return () => offMessageReadUpdate()
    }, [onMessageReadUpdate, offMessageReadUpdate, updateMessageReadStatus])

}