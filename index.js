import express from 'express';
import bodyParser from 'body-parser';
import auth from './middleware/authenticate.js';
const app = express();
const port = 3000;



app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

let posts = [
    {
        mangaID: 1,
        title: "SAKAMOTO DAYS",
        author: "Yuto Suzuki",
        publisher: "NA: Viz Media"
    },
    {
        mangaID: 2,
        title: "Mushoku Tensei",
        author: "Rifujin na Magonote",
        publisher: "Shōsetsuka ni Narō"
    },
    {
        mangaID: 3,
        title: "RE:Zero",
        author: "Tappei Nagatsuki",
        publisher: "Shōsetsuka ni Narō"
    },
    {
        mangaID: 4,
        title: "Konosuba",
        author: "Natsume Akatsuki",
        publisher: "Kadokawa Shoten"
    },
    {
        mangaID: 5,
        title: "Overlord",
        author: "Kugane Maruyama",
        publisher: "Shōsetsuka ni Narō"
    }
];

// Routes
app.get('/posts', auth, (req, res) => {
    res.json(posts);
});

app.get('/posts/:mangaID', (req, res) => {
    const mangaID = parseInt(req.params.mangaID);
    console.log(mangaID);

    const index = posts.findIndex((element) => element.mangaID === mangaID);
    console.log(index);

    if (index !== -1) {
        res.json(posts[index]);
    } else {
        res.status(404).json({ message: `Post with mangaID ${mangaID} not found.` });
    }
});

app.post('/share', (req, res) => {
    const { title, author, publisher } = req.body;

    const newData = {
        mangaID: posts.length + 1,
        title: title,
        author: author,
        publisher: publisher,
    };

    posts.push(newData);
    res.json({ message: "OKI DOKI" });
});

app.patch('/edit/:mangaID', (req, res) => {
    const mangaID = parseInt(req.params.mangaID);
    const index = posts.findIndex((element) => element.mangaID === mangaID);

    if (index !== -1) {
        const updatedData = {
            mangaID: posts[index].mangaID,
            title: req.body.title || posts[index].title,
            author: req.body.author || posts[index].author,
            publisher: req.body.publisher || posts[index].publisher,
        };

        posts[index] = updatedData;
        res.json(updatedData);
    } else {
        res.status(404).json({ message: `Post with mangaID ${mangaID} not found.` });
    }
});

app.delete('/delete/:mangaID', (req, res) => {
    const mangaID = parseInt(req.params.mangaID);
    const index = posts.findIndex((element) => element.mangaID === mangaID);

    if (index !== -1) {
        posts.splice(index, 1);
        res.status(200).json({ message: `Post with mangaID ${mangaID} has been deleted.` });
    } else {
        res.status(404).json({ message: `Post with mangaID ${mangaID} not found.` });
    }
});

const users = [
    { username: "CHARLIE", password: "POGIAKO" },
];

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        res.json({ message: "Login Success", user: { username: user.username } });
    } else {
        res.status(401).json({ message: "Invalid username or password" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
