router.get("/users/:id", (req, res) => {
    const id = req.params.id;
    if (id) {
        let user;
        global.dbo
            .collection("users")
            .find(
                {
                    _id: new mongo.ObjectID(id)
                },
                {
                    projection: {
                        _id: 0,
                        username: 1,
                        email: 1,
                        address: 1,
                        country: 1,
                        name: 1,
                        surname: 1,
                        bornDate: 1
                    }
                }
            )
            .toArray()
            .then(documents => {
                user = documents[0];

                let books;

                global.dbo
                    .collection("books")
                    .find({ users: { $in: [mongo.ObjectID(id)] } })
                    .toArray()
                    .then(documents => {
                        books = documents;

                        user.books = books;
                        res.send(user);
                    });
            });
    }
});