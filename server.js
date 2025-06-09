const WebSocket = require('ws');
const readline = require('readline');

// Create WebSocket server on port 3000
const wss = new WebSocket.Server({ port: 3000 });

console.log('🚀 WebSocket server running on ws://localhost:3000');
console.log('💡 Waiting for Unity and Spectacles connections...');

// Track connected clients
let connectedClients = [];

wss.on('connection', function connection(ws, req) {
    console.log('📱 New client connected! Total clients:', wss.clients.size);
    connectedClients.push(ws);
    
    ws.on('message', function message(data) {
        const messageStr = data.toString();
        console.log('🧠 RECEIVED FROM UNITY:', messageStr);
        
        // Broadcast to all connected clients (including Spectacles)
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(messageStr);
                console.log('📤 Forwarded to Spectacles:', messageStr);
            }
        });
    });
    
    ws.on('close', function() {
        console.log('📱 Client disconnected. Remaining clients:', wss.clients.size);
        connectedClients = connectedClients.filter(client => client !== ws);
    });
});

console.log('✅ Server ready!');
console.log('💡 Type "test" and press Enter to send test message to Spectacles');

// Create command line interface for manual testing
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (input) => {
    const command = input.trim().toLowerCase();
    
    if (command === 'test') {
        console.log('🧪 SENDING TEST MESSAGE TO ALL CLIENTS...');
        
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send('neural_event_triggered');
                console.log('📤 Sent "neural_event_triggered" to client');
            }
        });
        
        console.log('✅ Test message sent!');
    } else if (command === 'status') {
        console.log(`📊 Connected clients: ${wss.clients.size}`);
    } else if (command === 'help') {
        console.log('Commands:');
        console.log('  test   - Send test trigger to Spectacles');
        console.log('  status - Show connected clients');
        console.log('  help   - Show this help');
    } else {
        console.log('Unknown command. Type "help" for commands.');
    }
});

console.log('Type "help" for available commands');