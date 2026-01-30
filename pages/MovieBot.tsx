import Navbar from '../components/Navbar.tsx';
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Message from '../components/Message.tsx';

function MovieBot() {
    useEffect(() => {
        document.body.classList.remove("login", "home");
        document.body.classList.add("home");
    }, []);

    type ChatMessage = {
        role: string;
        text: string;
    }
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");

    //Calling the current user from localStorage and assigning them a unique chatkey to load their messages
    const user = JSON.parse(localStorage.getItem("currentUser")!);
    const chatKey = `chat_${user.username}`;

    const [messages, setMessages] = useState<ChatMessage[]>(
        JSON.parse(localStorage.getItem(chatKey) || "[]")
    )

    //Auto saving chat
    useEffect(() => {
        localStorage.setItem(chatKey, JSON.stringify(messages));
    }, [messages, chatKey]);

    const geminiKey = import.meta.env.VITE_GEMINI_KEY;

    const sendMessage = (text: string) => {
        console.log("sendMessage called with:", text);

        const cleaned = text.trim();
        if (!cleaned) return;

        //Adding user message
        setMessages((prev) => [...prev, {role: "user", text: cleaned}])
        setMessage("");

        console.log(import.meta.env.VITE_GEMINI_KEY);
        //Calling Gemini
        fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": geminiKey,
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: cleaned,
                            },
                        ],
                    },
                ],
            }),
        }
        )
        .then((res) => res.json())
        // Handling the response
        .then((data) => {
            // Saving AI's reply text here:
            const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Sorry - I couldn't generate a reply";

            //Adding AI response message
            setMessages((prev) => [...prev, { role: "ai", text: aiText}]);
        })

        // Catching any network or API errors
        .catch((err) => {
            console.error("Gemini API error:", err);
        });
    }

    return (
        <>
            <button
                type="button"
                className="hamburger"
                onClick={() => setOpen(true)}
            >
                <i className="fa-solid fa-bars" style={{ color: "#3f98e0" }}></i>
            </button>
            <Navbar open={open} onClose={() => setOpen(false)} />
            <div className="chat-page">
                <h1>MovieBot</h1>
                <div className="messages">
                    <Message 
                        role={'ai'} 
                        text={`
                            Hi, nice to meet you , I'm MovieBot - your helpful AI chatbot! \n
                            Ask me anything to do with movies - recommendations, genres, etc. `}
                    />
                    {
                        messages.map((m, index) => (
                            <Message key={index} role={m.role} text={m.text}/>
                        ))
                    }
                </div>
                <div className="prompt-wrapper">
                    <input 
                        type="text" 
                        placeholder='Give MovieBot a prompt'
                        className='prompt'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)} /*updating message value as user types*/
                        onKeyDown={(e) => {
                            if(e.key === 'Enter' && message.trim()) {
                                sendMessage(message);
                            }
                        }}
                    />
                    {message.trim().length > 0 && 
                        <button 
                            onClick={
                                () => {
                                    sendMessage(message);
                                }
                            }
                        >
                            <i className="fa-solid fa-arrow-up"></i>
                        </button> 
                    }
                </div>
            </div>
           
            
        </>
    )
}

export default MovieBot;