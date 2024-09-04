<div style="display:flex; align-items:center; justify-content:center; margin: 15px">
  <img src="https://pocketbase.io/images/logo.svg" width="75px" height="75px" title="Pocketbase logo" alt="Pocketbase logo" />
  <span style="font-size:50px">+</span>
  
  <img src="./assets/svelte_log.png" width="75" height="75" title="Pocketbase logo" alt="Pocketbase logo" />
</div>

<h1 style="text-align:center">Central Fill Helper</h1>

### About this Project

Very much a work in progress but is just working enough that I currently use it on a daily basis

This is a personal project created by me to make my job (and others) easier at the Fill Plant, Its designed mobile first as that is primarily where it will be used.

Please feel free to submit any issue as means of feedback or create a PR for bug fixes
/ wanted features.

### Requirements

- ["Just" runner](https://github.com/casey/just)
- Node
  - I use pnpm for my package manager
- [golang](https://go.dev/)

### How to run

open a terminal in file location and run

```bash
just dev-frontend
```

### Expected Features

- [ ] **Proper user navigation** (you have to type in /tools/bhc to get to the working p/assets/pdf_sample.png)
- [x] User Login
- [ ] User Management (via normal screen as its built into pocketbase)
- [x] Print BHC pdf billing paperwork
- [x] Document rack with photo evidence
- [ ] Document fill
  - [ ] Print lot stickers
  - [ ] Oxygen
- [ ] Backup of photos
- [ ] Warning when resources are low
- [ ] Weekly stats on fill quantities

![alt text](/assets/login_screen.png)

![new rack](/assets/new_rack.png)

![pdf sample](/assets/pdf_sample.png)
