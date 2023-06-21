const projectsTab = document.getElementById("projects-tab");
const allProjects = document.querySelector(".all-projects");
let projectsAll = document.querySelectorAll(".projects");
const newBtn = document.getElementById("new-btn");
const promptDiv = document.querySelector(".prompt");
const promptBg = document.getElementById("prompt-bg");
const priorityBtns = document.querySelectorAll(".priority");
const form = document.getElementById("form");
const template = document.getElementById("item-template");
const templateContent = template.content;
const projectTemplate = document.getElementById("project-template");
const projectTemplateContent = projectTemplate.content;
const allItems = document.querySelector(".items-all");
const date = document.getElementById("date");
const newProjects = document.getElementById("new-projects");
const projectName = projectTemplateContent.getElementById("name-span");
const newProjectPrompt = document.querySelector(".new-project-prompt");
let allBtns = document.querySelectorAll(".bs");
const secTitle = document.getElementById("sec-title");
// all chores object
const choresList = {
  inbox: [],
  today: [],
  upcoming: [],
  projects: {},
};
let projectNames = [];
let choreID = 0;

// prevent the user from making the same project
function validateForm() {
  const x = newProjectPrompt.newProjectName.value;
  if (projectNames.includes(x.toLowerCase())) {
    newProjectPrompt.reset();
    newProjectPrompt.newProjectName.setCustomValidity(
      `There is already a project named ${x}.`
    );
    newProjectPrompt.reportValidity();
    return false;
  }
  projectNames.push(x.toLowerCase());
}

// adjust labels
form.title.addEventListener("change", () => {
  if (form.title.value === "") form.title.ariaSelected = false;
  else form.title.ariaSelected = true;
});
form.details.addEventListener("change", () => {
  if (form.details.value === "") form.details.ariaSelected = false;
  else form.details.ariaSelected = true;
});

// create a new project
newProjects.addEventListener("click", () => {
  collapeProjectsTab(true);
  window.setTimeout(() => newProjectPrompt.newProjectName.focus(), 0);
  newProjectPrompt.style.display = "flex";
});
newProjectPrompt.addEventListener("submit", (e) => {
  e.preventDefault();
  if (newProjectPrompt.checkValidity()) {
    e.preventDefault();
    const projectName = projectTemplateContent.querySelector("span");
    projectName.textContent = newProjectPrompt.newProjectName.value;
    const clonedContent = projectTemplateContent.cloneNode(true);
    choresList.projects[newProjectPrompt.newProjectName.value.toLowerCase()] =
      [];
    newProjectPrompt.reset();
    newProjectPrompt.style.display = "none";
    console.table(choresList);
    allProjects.appendChild(clonedContent);
    projectsAll = document.querySelectorAll(".projects");
    allBtns = document.querySelectorAll(".bs");
  }

  // go to project
  goToProject();

  // remove project
  projectsAll.forEach((proj, i) => {
    proj.addEventListener("click", (e) => {
      if (e.target.classList[1] == "fa-x") {
        const x = projectsAll[i]
          .querySelector("span")
          .textContent.toLowerCase();
        delete choresList.projects[x];
        projectsAll[i].remove();
      }
    });
  });
});
newProjectPrompt.cancel.addEventListener("click", () => {
  newProjectPrompt.reset();
  newProjectPrompt.style.display = "none";
});

// sets minimum date
const today = new Date();
const year = today.getFullYear();
let month = (today.getMonth() + 1).toString().padStart(2, "0");
let day = today.getDate().toString().padStart(2, "0");

const minDate = `${year}-${month}-${day}`;
date.setAttribute("min", minDate);
// Collapseable projects tab
function collapeProjectsTab(bool) {
  if (bool) {
    allProjects.setAttribute("aria-hidden", false);
    projectsTab.innerHTML = '<i class="fa-solid fa-chevron-down"></i>';
    allProjects.style.maxHeight = "500px";
  } else {
    if (allProjects.getAttribute("aria-hidden") === "true") {
      allProjects.setAttribute("aria-hidden", false);
      projectsTab.innerHTML = '<i class="fa-solid fa-chevron-down"></i>';
      allProjects.style.maxHeight = "500px";
    } else {
      projectsTab.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
      allProjects.setAttribute("aria-hidden", true);
      allProjects.style.maxHeight = "0";
    }
  }
}
projectsTab.addEventListener("click", () => {
  collapeProjectsTab();
});

// open pop up
newBtn.addEventListener("click", () => {
  promptBg.style.cssText = "opacity:100; pointer-events: auto;";
  promptDiv.style.cssText = "opacity:100; pointer-events: auto;";
});
// close pop up
function closePopup() {
  promptBg.style.cssText = "opacity:0; pointer-events: none;";
  promptDiv.style.cssText = "opacity:0; pointer-events: none;";
  form.reset();
  form.title.ariaSelected = false;
  form.details.ariaSelected = false;
  priorityBtns[0].children[1].ariaChecked = true;
  priorityBtns[0].children[2].ariaChecked = false;
  priorityBtns[0].children[3].ariaChecked = false;
}
promptBg.addEventListener("click", (e) => {
  if (e.target.id == "prompt-bg") {
    closePopup();
  }
});
// change pop up buttons color
priorityBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.target.ariaChecked = true;
    for (let i = 1; i < 4; i++) {
      if (priorityBtns[0].children[i].id != e.target.id)
        priorityBtns[0].children[i].ariaChecked = false;
    }
  });
});

// constructor
function chore(title, priority, date, id) {
  this.title = title;
  this.priority = priority;
  this.date = date;
  this.id = id;
}
// adds objects into the chores object
chore.prototype.add = function (project) {
  choresList.inbox.push(this);
  if (project) {
    choresList.projects[project.toLowerCase()].push(this);
  }
};

// adds a new chore
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const secName = secTitle.textContent.trim();
  const isProject =
    secName == "Upcoming" || secName == "Today" || secName == "Inbox"
      ? false
      : true;
  const priority =
    form.pLow.ariaChecked == "true"
      ? "low"
      : form.pMedium.ariaChecked == "true"
      ? "medium"
      : "high";
  const d = new Date(date.value);
  const c = new chore(form.title.value, priority, d, choreID);
  choreID++;
  if (isProject) c.add(secName.toLowerCase());
  else c.add();
  if (!isProject) printChores(choresList[secName.toLowerCase()]);
  else printChores(choresList.projects[secName.toLowerCase()]);
  closePopup();
});

// prints all chores
function printChores(chores) {
  deleteChores(allItems);
  chores.forEach((c, i) => {
    const title = templateContent.querySelector("h2");
    const items = templateContent.querySelector(".items");
    const date = templateContent.querySelector("p");
    const color =
      c.priority == "low"
        ? "var(--green)"
        : c.priority == "medium"
        ? "var(--yellow)"
        : "var(--red)";
    title.textContent = c.title;
    if (c.date != "Invalid Date") {
      const month = c.date.toLocaleString("default", { month: "short" });
      date.textContent = `${month} ${c.date.getDate()}`;
    } else date.textContent = `No Date`;
    items.style.borderLeft = `5px solid ${color}`;
    const clonedContent = templateContent.cloneNode(true);
    allItems.appendChild(clonedContent);

    const all = allItems.querySelectorAll("li");
    const trash = all[i].querySelector(".fa-trash");
    const checkbox = all[i].querySelector(".checkbox");
    // removes chore when clicking on trash
    trash.addEventListener("click", () => {
      all[i].remove();
      // delete the chore from its project array
      for (let j in choresList.projects) {
        for (let i = 0; i < choreID; i++) {
          if (choresList.projects[j][i])
            if (c.id == choresList.projects[j][i].id)
              choresList.projects[j].splice(i, 1);
        }
      }
      // delete the chore from Inbox, Today and Upcoming arrays
      for (let i = 0; i < choreID; i++) {
        if (choresList.inbox[i])
          if (c.id == choresList.inbox[i].id) choresList.inbox.splice(i, 1);
        if (choresList.today[i])
          if (c.id == choresList.today[i].id) choresList.today.splice(i, 1);
        if (choresList.upcoming[i])
          if (c.id == choresList.upcoming[i].id)
            choresList.upcoming.splice(i, 1);
      }
      // choresList.inbox.splice(choresList.inbox.indexOf(c));
      // if (chores == choresList.inbox) return;
      // chores.splice(chores.indexOf(c), 1);
    });
    // changes element when checking
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) all[i].ariaChecked = true;
      else all[i].ariaChecked = false;
    });
  });
}
// deletes all chores
function deleteChores(i) {
  while (i.firstChild) i.removeChild(i.firstChild);
}

// go to project

function goToProject() {
  if (allBtns && allBtns.length) {
    for (let i = 0; i < allBtns.length; i++) {
      allBtns[i].addEventListener("click", (e) => {
        if (e.target.className == "fa-solid fa-x") {
          if (e.target.parentElement.parentElement) {
            allBtns[0].ariaSelected = true;
            secTitle.textContent = "Inbox";
            printChores(choresList["inbox"]);
          }
          return;
        }

        for (let b of allBtns) {
          if (b.className == "projects btns bs")
            b.children[0].ariaSelected = false;
          else b.ariaSelected = false;
        }
        if (allBtns[i].className == "projects btns bs")
          allBtns[i].children[0].ariaSelected = true;
        else allBtns[i].ariaSelected = true;
        const n = e.target.textContent.trim();
        secTitle.textContent = n;

        const todayDate = new Date();
        const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
        if (secTitle.textContent == "Today") {
          choresList.today = choresList.inbox.filter((d) => {
            return (
              d.date.getDate() == todayDate.getDate() &&
              d.date.getFullYear() == todayDate.getFullYear() &&
              d.date.getMonth() == todayDate.getMonth()
            );
          });
        }
        if (secTitle.textContent == "Upcoming") {
          choresList.upcoming = choresList.inbox.filter(
            (d) =>
              d.date.getTime() - todayDate.getTime() < oneWeekInMilliseconds
          );
        }
        if (
          secTitle.textContent != "Upcoming" &&
          secTitle.textContent != "Today" &&
          secTitle.textContent != "Inbox"
        )
          printChores(choresList.projects[n.toLowerCase()]);
        else printChores(choresList[n.toLowerCase()]);
      });
    }
  }
}

goToProject();
