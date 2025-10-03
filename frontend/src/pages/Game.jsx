import { useEffect, useRef, useState } from "react";

export default function Game() {
    const canvasRef = useRef(null);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [dialog, setDialog] = useState(null)

    // if user uses small screen, just return a sentence

    useEffect(() => {
        const handleResize = () => {
        setIsSmallScreen(window.innerWidth < 700); // threshold, adjust as needed
        };

        handleResize(); // check once on load
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        
        const idleImg = new Image();
        idleImg.src = '/game_img/idle.png';
        const walk1Img = new Image();
        walk1Img.src = '/game_img/walk1.png';
        const walk2Img = new Image();
        walk2Img.src = '/game_img/walk3.png';
        const bgImg = new Image();
        bgImg.src = "/game_img/background.png";
        const cocoImg = new Image();
        cocoImg.src = '/game_img/coco.png'
        const tommyImg = new Image();
        tommyImg.src = '/game_img/tommy.png'
        

        let player = {
            x: 280,
            y: 300,
            width: 128,
            height: 128,
            vx: 0,
            vy: 0,
            onGround: false,
            frame: 0,
            currentImg: idleImg,
        };

        let coco = {
            x: 20,
            y: 250,
            width: 128,
            height: 128,
            onGround: true,
            currentImg: cocoImg
        }

        let tommy = {
            x: canvas.width - 128,
            y: 240,
            width: 128,
            height: 128,
            onGround: true,
            currentImg: tommyImg
        }

        const keys = {};
        window.addEventListener("keydown", (e) => (keys[e.key] = true));
        window.addEventListener("keyup", (e) => (keys[e.key] = false));

        const gravity = 0.5;
        const groundY = 330; // 地板位置

        function update() {
        // 移動邏輯
        if (keys["ArrowRight"]) {
            player.vx = 2;
        } else if (keys["ArrowLeft"]) {
            player.vx = -2;
        } else {
            player.vx = 0;
        }

        // 跳躍
        if (keys[" "] && player.onGround) {
            player.vy = -10;
            player.onGround = false;
        }

        // 套用物理
        player.vy += gravity;

        // let the player not bump into the wall
        if (player.x + player.vx < -40) {
            player.x = player.x
        } else if (player.x + player.vx > canvas.width - 96) {
            player.x = player.x
        } else {
            player.x += player.vx;
        }
       
        player.y += player.vy;

        // 碰撞地板
        if (player.y + player.height >= groundY) {
            player.y = groundY - player.height;
            player.vy = 0;
            player.onGround = true;
        }

        // 切換圖片（Idle / Walk）
        if (player.vx !== 0) {
            player.frame++;
            if (player.frame % 20 < 10) {
            player.currentImg = walk1Img;
            } else {
            player.currentImg = walk2Img;
            }
        } else {
            player.currentImg = idleImg;
        }
        }

        function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const scale = 0.8
        ctx.drawImage(bgImg, 0, 0, bgImg.width * scale, bgImg.height * 0.6);

        // 畫角色
        ctx.drawImage(
            player.currentImg,
            player.x,
            player.y,
            player.width,
            player.height
        );

        // draw coco
        ctx.drawImage(
            coco.currentImg,
            coco.x,
            coco.y,
            coco.width,
            coco.height,
        )

        // draw tommy
        ctx.drawImage(
            tommy.currentImg,
            tommy.x,
            tommy.y,
            tommy.width,
            tommy.height,
        )
        }

        

        function gameLoop() {
        update();
        draw();
        requestAnimationFrame(gameLoop);
        }

        gameLoop();
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Prevent page scroll when pressing Space
            if (e.code === "Space") {
            e.preventDefault();
            // put your jump logic here if needed
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
        }, []);


    if (isSmallScreen) {
        return (
        <div
            style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "1.5rem",
            textAlign: "center",
            }}
        >
            This game can only be played on a larger screen.
        </div>
        );
    }

    return (
        <div
            style={{
            display: "flex",
            flexDirection: 'column',
            justifyContent: "center",
            alignItems: "center",
            }}
        >
            <canvas
            ref={canvasRef}
            width={640}
            height={360}
            style={{
                border: "2px solid black",
                backgroundImage: "url('/background.png')",
                backgroundSize: "cover",
            }}
            />
            <small>Use Arrow Right and Left to move, Space to Jump, and Enter to interact.</small>
        </div>
    );
        }