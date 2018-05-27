# Stub Management Tool

This is a Web Based Tool to Management Rest & Soap Based Stubs which can be Run/Test and deployed to MounteBank Server

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

you need to have NodeJs on your mechine
you might also need to install MounteBank. if you want to Run/Test the created stub before deploying


### Installing

A step by step series of examples that tell you how to get a development env running

Download Zip file from github and Un-Zip Code 
CD into the folder containing the code
```
cd StubManagementTool
```

And Run the following command to start the tool

```
node index.js
```

and the tool should be avalable on port 3000 http://localhost:3000 as shown below 
![image](https://user-images.githubusercontent.com/13693247/40586710-e906dc5c-61bd-11e8-9247-266e687c5d97.png)
![image](https://user-images.githubusercontent.com/13693247/40586811-382decc0-61bf-11e8-876e-8d2e92cc0af6.png)
![image](https://user-images.githubusercontent.com/13693247/40586854-b978964a-61bf-11e8-81fa-d45846962e52.png)


## Running the tests

To run the automated tests for this system

### To test File System test

run the following command

```
node TestSystem.js
```
go to http://localhost:7978 it will show the outcomes of the test as shown below.

![image](https://user-images.githubusercontent.com/13693247/40586791-f21d78ea-61be-11e8-97b7-67da8e26e839.png)




### To test MounteBank Injection test

run the following command

```
TestInjection.js
```
go to http://localhost:7979 it will show the outcomes of the test as shown below.
![image](https://user-images.githubusercontent.com/13693247/40586750-5cc58396-61be-11e8-8164-544dafe8e9e7.png)

## Built With

* [NodeJs](https://nodejs.org/en/) - The BackEnd framework used
* [ExpressJs](https://nodejs.org/en/) - The MVC web framework used
* [Angularjs](https://angularjs.org/) - The Javascript web framework used
* [Graceful-fs](https://www.npmjs.com/package/@types/graceful-fs) - Graceful File I/O Management

## Authors

* **Adil Khan** - *Design & Build* - [LinkedIn](https://uk.linkedin.com/in/adil-khan-466155b7)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
