//only holds the state and data
class Model {
  constructor() {
    this.contacts = [];
    this.filteredContacts = [];
    this.sorted = false;
  }
}

//handles the DOM and helps dispatches the controller functions
class View {
  constructor() {
    this.form = document.querySelector(".contact__form");
    this.name = document.querySelector("#name");
    this.mobile = document.querySelector("#mobile");
    this.email = document.querySelector("#email");
    this.search = document.querySelector("#search");
    this.table = document.querySelector("#summaryTable");
    this.tableName = document.querySelector("#nameColumn");
    this.isFilteredOrNot = false;

    this.contactRows = document.querySelector("tbody");
  }

  renderContacts(contacts) {
    if (contacts.length === 0) {
      this.contactRows.innerHTML = "";

      const text = document.createElement("p");
      text.textContent = "There are no contacts at this moment.";
      this.contactRows.append(text);
    } else {
      this.contactRows.innerHTML = "";

      contacts.forEach((contact) => {
        this.contactRows.innerHTML += `
        <tr>
              <td>${contact.name}</td>
              <td>${contact.mobile}</td>
              <td>${contact.email}</td>
            </tr>`;
      });
    }
  }

  addContact = (addcontroller) => {
    const el = document.querySelector("#error");
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();

      let nameValidator = /^[a-zA-Z ]*$/;

      if (
        this.name.value.match(nameValidator) &&
        this.name.value.length !== "" &&
        this.mobile.value !== "" &&
        this.mobile.value.length <= 10 &&
        this.email.value.length !== 0
      ) {
        el.classList.add("dn");
        addcontroller(this.name.value, this.mobile.value, this.email.value);
        this.name.value = "";
        this.mobile.value = "";
        this.email.value = "";
        return true;
      } else {
        el.classList.remove("dn");
        return false;
      }
    });
  };

  mobileSearch = (searchController) => {
    this.search.addEventListener("input", (e) => {
      searchController(e.target.value);
    });
  };

  sortColumn = (sortController, sortController2) => {
    this.table.addEventListener("click", (e) => {
      if (e.target.id == "nameColumn" && this.isFilteredOrNot == false) {
        sortController();
      } else if (e.target.id == "nameColumn" && this.isFilteredOrNot == true) {
        sortController2();
      }
    });
  };
}

//will be invoked and probably passed down value by the view to perform functionality on the model
//links view(client) to mode(server)
class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.addContact(this.addItem);
    this.view.mobileSearch(this.searchItems);
    this.view.sortColumn(this.sortItems, this.sortFilteredItems);

    this.init(this.model.contacts);
  }

  init = () => {
    this.view.renderContacts(this.model.contacts);
  };

  addItem = (name, mobile, email) => {
    const contact = {
      id:
        this.model.contacts.length > 0
          ? this.model.contacts[this.model.contacts.length - 1].id + 1
          : 0,
      name: name,
      mobile: mobile,
      email: email,
    };
    this.model.contacts.push(contact);
    console.log(this.model.contacts);
    this.view.renderContacts(this.model.contacts);
  };

  searchItems = (input) => {
    this.view.isFilteredOrNot = true;
    const el = document.querySelector("#noResult");
    this.model.filteredContacts = this.model.contacts.filter((contact) =>
      contact.mobile.includes(input)
    );
    if (this.model.filteredContacts.length === 0) {
      el.classList.remove("dn");
    } else {
      el.classList.add("dn");
    }
    this.view.renderContacts(this.model.filteredContacts);
  };

  sortItems = () => {
    let sorted = [];
    if (!this.model.sorted) {
      sorted = this.model.contacts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (this.model.sorted) {
      sorted = this.model.contacts
        .sort((a, b) => a.name.localeCompare(b.name))
        .reverse();
    }
    this.model.sorted = !this.model.sorted;
    console.log(this.model.sorted);
    this.view.renderContacts(sorted);
  };

  sortFilteredItems = () => {
    let sorted = [];
    if (!this.model.sorted) {
      sorted = this.model.filteredContacts.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    } else if (this.model.sorted) {
      sorted = this.model.filteredContacts
        .sort((a, b) => a.name.localeCompare(b.name))
        .reverse();
    }
    this.model.sorted = !this.model.sorted;
    console.log(this.model.sorted);
    this.view.renderContacts(sorted);
  };
}

const app = new Controller(new Model(), new View());
