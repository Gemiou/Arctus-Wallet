# Arctus-Wallet
## Arctus is an open-source multi-currency wallet, with advanced user-intuitive layout, focusing on providing users with complete ownership over their assets.

For the Arctus Wallet application, we are utilising Angular 5.X as our infrastructure framework. 

Along with Angular we have used numerous Node modules for creating an intuitive experience but for the core parts of the application we mostly use the CryptoJS library for per-session encryption and the ethers.js & bitcoinjs-lib libraries for handling the cryptocurrency heavy work. 

Among the plugins we have included the most notable ones are Vibrant for extracting the dominant color of a cryptocurrencies image for the pie chart and p-any for fetching the fastest API from the ones we have included.

Our wallet can theoretically support all types of cryptocurrencies as it derives all keys from a hex-encoded master key that is at all times per-session encrypted and never stored on the computer.

Specifically, the login feature generates the master phrase by concating and multiple re-hashing of the input variables through keccak-256 cycles.

The interface is personalised by appending a unique member to your JSON backup and Gaia hub/local storage, the latter retrieved on each login by saving the preferences under the 'preferences-yourPublicAddress' alias, where yourPublicAddress is substituted by your ECC hex-encoded address, the same one used in Ethereum and derivatives.

Support for ERC tokens is achieved via "shell" implementation of the ERC-20 ABI where only the members "transfer" and "balanceOf" are integrated as they are the only ones that concern Arctus at this point.

The chat bot functions via multiple if-clauses and passes the input through various "RegExp" (Regular Expressions) to extract the correct parameters for carrying out a command such as "transfer 1 ETH to 0x0..." and "convert 43.2 OMG to BTC".

### Instalation 
To install Arctus:

*pm install 
*// The above instruction will fail on the latest release due to a dependency missing, simply run npm install nameOfDep to fix
ng serve -o

### Prerequisites
*Angular 5.X
*Node.JS

## List of all components subject to open source licenses or other 3rd party licenses used in the development of the application
### NPM Modules: 
blockstack, shapeshift.io, chart.js, countup.js, bigi, bitcoinjs-lib, ethers, js-sha3, p-any, node-vibrant, rxjs, crypto-js, angularx-qrcode, electron, electorn-packager and all Angular-related dependencies

-All logos apart from the main Arctus logo are owned by their perspective creators and/or entities.
