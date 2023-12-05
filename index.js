import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'

const users = new Set()

// start server and spin up socket
const serverAndSocketConnector = () => {
    const app = express()
    const httpConnection = createServer(app)
    const socket = new Server(httpConnection)

    try {
        // create a socket connection
        socket.on('connection', (soc) => {
            console.log('User has been connected')

            // broad welcome message to all connected client
            socket.local.emit('new user', 'Welcome to our chat channel')
    
            soc.on('new user', () => {
                users.add(soc.id)
                socket.local.emit('new user', `Welcome user ${soc.id}`)
            })
    
            soc.on('message', (message) => {
                console.log('Received message:', message);
                socket.local.emit('message', message);
            });
    
            soc.on('disconnect', () => {
                console.log('User Disconnected')
            })

        })
    } catch (error) {
        throw new Error('An error has ocurred while trying to connect to the server')
    }

    httpConnection.listen(3001, () => {
        console.log(`App listening to port 3001`)
    })
}

serverAndSocketConnector()

// NB: I used postman as client to test the WebSocket server