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

and the tool should be avalable on port 3000 http://localhost:3000

## Running the tests

To run the automated tests for this system

### To test File System test

run the following command

```
node TestSystem.js
```
go to http://localhost:8080 it will show the outcomes of the test.

### To test MounteBank Injection test

run the following command

```
TestInjection.js
```
stem

## Built With

* [NodeJs](https://nodejs.org/en/) - The BackEnd framework used
* [ExpressJs](https://nodejs.org/en/) - The MVC web framework used
* [Angularjs](https://angularjs.org/) - The Javascript web framework used
* [Graceful-fs](https://www.npmjs.com/package/@types/graceful-fs) - Graceful File I/O Management

## Authors

* **Adil Khan** - *Design & Build* - [LinkedIn](https://uk.linkedin.com/in/adil-khan-466155b7)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
