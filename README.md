## Get A Shell 🐚

Have you ever wanted to just spin up a quick server than you can ssh into to test something real quick? Well with get a shell
you can just spin up the ui select a distro and click _Get me a shell!_ and 💥 you have an ssh server with your specified distro. No need to spin up vms, run commands or anything harder than a click!

![Preview](screenshots/app.png)

> Warning ⚠️: The app is in early stages of development, I am still quite new to both writing full stack apps and using technologies like drizzle and react. Any contributions are welcome.

### Todo

- [x] Ability to pass extra arguments to shells
- [ ] Ability to save shell user data
- [ ] Ability to start shells on app start
- [ ] Make the app know if shell is started or not
- [ ] Edit shell password/port
- [ ] Handle db migrations on target computer not on build time

### Installation ⏬

The installation is fast and straight forward. Just run the docker command bellow and you will have your ui ready in less than 5 minutes (depending on your internet connection lol).

```Bash
docker run -td --name getashell -p 3000:3000 --add-host=host.docker.internal:host-gateway -v /var/run/docker.sock:/var/run/docker.sock ghcr.io/steveiliop56/getashell:latest
```

If you would like to store the database too run this command:

```Bash
docker run -td --name getashell -p 3000:3000 --add-host=host.docker.internal:host-gateway -v /some/awesome/location/data:/app/data -v /var/run/docker.sock:/var/run/docker.sock ghcr.io/steveiliop56/getashell:latest
```

> Note 🗒️: The app right now doesn't support restarting the shells you create, moreover it has no way to know if one stopped or failed. That doesn't mean that the app can't be restarted. As long as you just restart the app itself your shells will be kept.

### Contributing ❤️

As I mentioned above I am fairly new to all these technologies and my code may be _probably is_ terrifying to look at. Any contributions on fixing my mistakes (lol) are welcome.

### License 📜

The project is licensed under the GPL V3 License. You may modify, distribute and copy the code as long as you keep the changes in the source files. Any modifications you make using a compiler must be also licensed under the GPL license and include build and install instructions.

### Credits

[Nicolas](https://github.com/meienberger), thank you once again for helping me with workflow and docker stuff lol.
