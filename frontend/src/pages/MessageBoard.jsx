import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MessageBoard() {
    const [interactive_number, setInteractiveNumber] = useState(0);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
}