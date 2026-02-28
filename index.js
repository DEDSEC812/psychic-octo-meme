<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>SIRIUS - Developer is Back</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: Arial, Helvetica, sans-serif;
        }

        body {
            height: 100vh;
            overflow: hidden;
            color: white;
            text-align: center;
        }

        /* VIDEO BACKGROUND */
        video {
            position: fixed;
            top: 0;
            left: 0;
            min-width: 100%;
            min-height: 100%;
            object-fit: cover;
            z-index: -1;
        }

        /* DARK OVERLAY */
        .overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            z-index: -1;
        }

        .container {
            position: relative;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0, 0, 0, 0.7);
            padding: 40px;
            border-radius: 15px;
            max-width: 500px;
            margin: auto;
            box-shadow: 0 0 25px rgba(0,0,0,0.7);
        }

        h1 {
            font-size: 2rem;
            margin-bottom: 15px;
            color: #00f5ff;
        }

        p {
            font-size: 1.1rem;
            margin-bottom: 20px;
            line-height: 1.6;
        }

        .btn {
            display: inline-block;
            padding: 10px 20px;
            background: #00f5ff;
            color: black;
            text-decoration: none;
            border-radius: 25px;
            font-weight: bold;
            transition: 0.3s ease;
        }

        .btn:hover {
            background: white;
            color: #203a43;
        }

        footer {
            margin-top: 20px;
            font-size: 0.9rem;
            opacity: 0.8;
        }
    </style>
</head>

<body>

    <!-- Background Video -->
    <video autoplay muted loop playsinline>
        <source src="https://h.uguu.se/HxZYnilf.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>

    <div class="overlay"></div>

    <div class="container">
        <h1>🚀 SIRIUS is Back</h1>
        <p>
            Hello guys,<br>
            Ce petit site est pour vous annoncer mon retour dans le monde du développement.
            Désormais, je me spécialise dans la création d'applications et de sites web.
        </p>

        <a href="#" class="btn">Me contacter</a>

        <footer>
            © 2026 Powered by SIRIUS
        </footer>
    </div>

</body>
</html>
