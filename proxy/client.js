<script>
    const socket = new WebSocket('ws://glgHandler.replit.app'); // Change to your server's IP if needed

    socket.addEventListener('open', function(event) {
        console.log('Connected to WebSocket server');
    });

    socket.addEventListener('message', function(event) {
        console.log('Message from server:', event.data);
        const data = JSON.parse(event.data);
        if (data.fileLink) {
            const audio = new Audio(data.fileLink);
            audio.play();
        }
    });

    socket.addEventListener('error', function(event) {
        console.error('WebSocket error:', event);
    });

    socket.addEventListener('close', function(event) {
        console.log('WebSocket connection closed:', event);
    });
</script>
