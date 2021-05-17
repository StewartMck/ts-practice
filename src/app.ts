// validation

// ? = undefined (e.g. boolean | undefined)
interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

function validate(validatableInput: Validatable) {
    let isValid = true;
    if(validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0; 
    }

    if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
         isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
    }

    if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
   }

   if(validatableInput.min != null && typeof validatableInput === 'number') {
       isValid = isValid && validatableInput!.value >= validatableInput!.min;
   }

   if(validatableInput.max != null && typeof validatableInput === 'number') {
    isValid = isValid && validatableInput!.value <= validatableInput!.max;
}

    return isValid
}


// autobind decorator - _ = special (not going to use parameters but need them)
function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}

class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    // <> Type casting tells typescript what element will be & ! guarantees that element will be there
    this.templateElement = <HTMLTemplateElement>(
      document.getElementById("project-input")!
    );
    this.hostElement = document.getElementById("app")! as HTMLDivElement;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLFormElement;
    // assigning css id
    this.element.id = "user-input";

    // find specific elements in form element
    this.titleInputElement = this.element.querySelector(
      "#title"
    )! as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    )! as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      "#people"
    )! as HTMLInputElement;

    this.configure();
    this.attach();
  }

  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }

  // return tupe of 3 elements
  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    const titleValidatable: Validatable = {
        value: enteredTitle,
        required: true,
    };

    const descriptionValidatable: Validatable = {
        value: enteredDescription,
        required: true,
        minLength: 5,
    }

    const peopleValidatable: Validatable = {
        value: +enteredPeople,
        required: true,
        min: 1,
    }
    
    if (
        !validate(titleValidatable) ||
        !validate(descriptionValidatable) ||
        !validate(peopleValidatable)
    ) {
      alert("Invalid input, please try again!");
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  private clearInputs() {
      this.titleInputElement.value = '';
      this.descriptionInputElement.value = '';
      this.peopleInputElement.value = '';
  }


  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();

    if(Array.isArray(userInput)) {
        const [title, description, people] = userInput;
        console.log(title, description, people)
        this.clearInputs();
    }

  }

  private configure() {
    // must bind this - so context is class and not event
    this.element.addEventListener("submit", this.submitHandler);
  }
}

const prjInput = new ProjectInput();
