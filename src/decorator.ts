function validateExample(this: any, _: Object, propertyKey: string) {
    console.log('this', this)
    console.log('propKey', propertyKey)
    let value = this[propertyKey]
    console.log('value:', value)    
}

class User {

    @validateExample
    userName: string;
    // password: string;

    constructor(userName: string, _: string) {
        this.userName = userName;
        // this.password = password;
    }
}

const a = new User('Test', '123')
console.log(a)