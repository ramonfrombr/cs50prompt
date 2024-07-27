const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const httpServer = http.createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // Replace with your frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

const roomsAndPrompts = [
  {
    roomId: "room1",
    prompt: `1  - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

2 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

3 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

4 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

5 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

6 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

7 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

8 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

9 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

10 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

11 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

12 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

13 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

14 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

15 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

16 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

17 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

18 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

19 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

20 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

21 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

22 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

23 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

24 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

25 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

26 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

27 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

28 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

29 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

30 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

31 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

32 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

33 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

34 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

35 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

36 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

37 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

38 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

39 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

40 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

41 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

42 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

43 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

44 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

45 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

46 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

47 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

48 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

49 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.

50 - A teleprompter, also known as an autocue, is a device used in television, film production, and public speaking to display a scrolling script or speech for presenters to read from while appearing to maintain eye contact with the audience or camera.`,
  },
];

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`user with id-${socket.id} joined room - ${roomId}`);
  });

  socket.on("create_prompt", (roomId, promptText) => {
    const newRoomAndPrompt = {
      roomId: roomId,
      prompt: promptText,
    };
    roomsAndPrompts.push(newRoomAndPrompt);
    socket.join(roomId);
  });

  socket.on("get_prompt_text", (roomId) => {
    console.log("GET_PROMPT_TEXT");
    const promptText = roomsAndPrompts
      .filter((item) => item.roomId === roomId)
      .map((item) => item.prompt)[0];

    io.in(roomId).emit("receive_prompt_text", promptText);
  });

  socket.on("send_start_prompt", (roomId) => {
    io.in(roomId).emit("receive_start_prompt");
  });

  socket.on("send_restart_prompt", (roomId) => {
    io.in(roomId).emit("receive_restart_prompt");
  });

  socket.on("send_define_font_size", (roomId, fontSize) => {
    console.log("SEND_DEFINE_FONT_SIZE");
    console.log(fontSize);
    io.in(roomId).emit("receive_define_font_size", fontSize);
  });

  socket.on("send_scroll_up", (roomId) => {
    console.log("SEND_SCROLL_UP");
    io.in(roomId).emit("receive_scroll_up");
  });

  socket.on("send_scroll_down", (roomId) => {
    console.log("SEND_SCROLL_DOWN");
    io.in(roomId).emit("receive_scroll_down");
  });

  socket.on("get_prompts", () => {
    io.in("home").emit("receive_prompts", roomsAndPrompts);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.io server is running on port ${PORT}`);
});
