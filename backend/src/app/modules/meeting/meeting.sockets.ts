import { Server, Socket } from 'socket.io';
import { socketVerifyToken as verifyToken } from '../../utils/socketVerifyToken';
import { RegistrationModel } from '../Register/register.model';
import MeetingModel from './meeting.model';
interface Message {
    userId: string;
    userName: string;
    text: string;
    timestamp: Date;
    replyTo?: string; // ID of the message being replied to
}

interface UserSocket {
  userId: string;
  socketId: string;
  
}

const userSockets: UserSocket[] = [];

export const handleSocketConnection = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log('A user connected:', socket.id);

        // --- Join Meeting (Socket) ---
        // socket.on('join-meeting', async ({ meetingId, token }) => {
        //     try {
        //         const decoded = verifyToken(token);
        //         const userId = decoded._id;

        //         // Add user to the Socket.IO room
        //         socket.join(meetingId);

        //          // Find the user in your database to get the name.
        //         const user = await RegistrationModel.findById(userId);
        //         if (!user) {
        //             throw new Error("User not found"); // Handle this error appropriately
        //         }
        //         const userName = `${user.firstName} ${user.lastName}`;

        //         // Store the user's socket ID
        //         userSockets.push({ userId, socketId: socket.id });

        //         // Notify other participants in the meeting
        //         io.to(meetingId).emit('user-joined', { userId, userName });

        //         console.log(`User ${userId} joined meeting ${meetingId}`);
        //          // Send a welcome message to the user who just joined.
        //         socket.emit('message', {
        //             userId: 'system',
        //             userName: 'System',
        //             text: `Welcome to the meeting, ${userName}!`,
        //             timestamp: new Date(),
        //         });

        //     } catch (error: any) {
        //         console.error("Join Meeting Socket Error:", error);
        //         socket.emit('error', { message: 'Failed to join meeting: ' + error.message });
        //     }
        // });
        socket.on('join-meeting', async ({ meetingId, token }) => {
      try {
        const decoded = verifyToken(token);
        const userId = decoded._id;

        // Add user to the Socket.IO room
        socket.join(meetingId);

        // Find the user in your database to get the name.
        const user = await RegistrationModel.findById(userId);
        if (!user) {
          throw new Error("User not found");
        }
        const userName = `${user.firstName} ${user.lastName}`;

        // Store the user's socket ID
        userSockets.push({ userId, socketId: socket.id });

        // Notify other participants in the meeting
        io.to(meetingId).emit('user-joined', { userId, userName });

        console.log(`User ${userId} joined meeting ${meetingId}`);

        // --- Emit initial messages to the newly joined user ---
        const meeting = await MeetingModel.findOne({ meetingId });
        if (meeting && meeting.messages) {
          socket.emit('initial-messages', meeting.messages);
        }

        // Send a welcome message to the user who just joined.
        socket.emit('message', {
          userId: 'system',
          userName: 'System',
          text: `Welcome to the meeting, ${userName}!`,
          timestamp: new Date(),
        });

      } catch (error: any) {
        console.error("Join Meeting Socket Error:", error);
        socket.emit('error', { message: 'Failed to join meeting: ' + error.message });
      }
    });

        // --- Send Message (Socket) ---
        // Send Message (Socket)
socket.on('message', async ({ meetingId, text, replyTo, token }) => {
  try {
      if (!token) throw new Error('Unauthorized');
      const decoded = verifyToken(token);
      const userId = decoded._id;
      console.log(meetingId, 'again token meetingId')

    const user = await RegistrationModel.findById(userId);
    if (!user) throw new Error("User not found");

    const userName = `${user.firstName} ${user.lastName}`;
    const message: Message = {
      userId,
      userName,
      text,
      timestamp: new Date(),
      replyTo,
    };

    // Save the message in the meeting document
    const meeting = await MeetingModel.findOne({ meetingId });
    if (!meeting) throw new Error("Meeting not found");

    meeting.messages = meeting.messages || []; // initialize if missing
    meeting.messages.push(message);
    await meeting.save();

    // Emit to all participants
    io.to(meetingId).emit('message', message);

  } catch (error: any) {
    console.error("Message Socket Error:", error);
    socket.emit('error', { message: 'Failed to send message: ' + error.message });
  }
});

        // socket.on('message', async ({ meetingId, text, replyTo,token }) => {
        //     console.log('Message received:', text);

        //     try {
        //         // const token = socket.handshake.headers.authorization?.split(' ')[1];
        //         console.log(token)
        //          if (!token) {
        //             throw new Error('Unauthorized');
        //          }
        //         const decoded = verifyToken(token);
        //         const userId = decoded._id;

        //         // Find the user in your database to get the name.
        //         const user = await RegistrationModel.findById(userId);
        //          if (!user) {
        //             throw new Error("User not found"); // Handle this error appropriately
        //          }
        //         const userName = `${user.firstName} ${user.lastName}`;
        //         const message: Message = {
        //             userId,
        //             userName,
        //             text,
        //             timestamp: new Date(),
        //             replyTo,
        //         };
                

        //         // Broadcast the message to all participants in the meeting
        //         io.to(meetingId).emit('message', message);
        //     } catch (error: any) {
        //          console.error("Message Socket Error:", error);
        //         socket.emit('error', { message: 'Failed to send message: ' + error.message });
        //     }
        // });

         // --- Leave Meeting (Socket) ---
        socket.on('leave-meeting', async ({ meetingId }) => {
            try {
                const token = socket.handshake.headers.authorization?.split(' ')[1];
                if (!token) {
                    throw new Error('Unauthorized');
                }
                const decoded = verifyToken(token);
                const userId = decoded._id;

                // Remove the user from the Socket.IO room
                socket.leave(meetingId);

                 // Remove the user's socket ID
                const userSocketIndex = userSockets.findIndex(us => us.userId === userId);
                if (userSocketIndex > -1) {
                    userSockets.splice(userSocketIndex, 1);
                }

                // Remove user from the meeting's participant list in the database
                const meeting = await MeetingModel.findOne({ meetingId });
                if (meeting) {
                    meeting.participants = meeting.participants.filter(p => p !== userId);
                    await meeting.save();

                    // Notify other participants
                    const user = await RegistrationModel.findById(userId);
                    const userName = user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
                    io.to(meetingId).emit('user-left', { userId, userName });
                }

                console.log(`User ${userId} left meeting ${meetingId}`);
            } catch (error: any) {
                console.error("Leave Meeting Socket Error:", error);
                socket.emit('error', { message: 'Failed to leave meeting: ' + error.message });
            }
        });

        // --- Disconnect (Socket) ---
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
            // Clean up userSockets array
            const userSocketIndex = userSockets.findIndex(us => us.socketId === socket.id);
            if (userSocketIndex > -1) {
                const disconnectedUser = userSockets[userSocketIndex];
                 // Optionally, remove the user from any meetings they are in
                userSockets.splice(userSocketIndex, 1);
                //  You might want to emit a 'user-left' event here, but you'd need to know *which* meeting
                //  the user was in.  This is tricky, as Socket.IO doesn't directly provide this.
                //  One approach is to store { userId, meetingId, socketId } in userSockets.
            }
        });
    });
};