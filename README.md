# Christmas Lottery Report

## Smart Contract Implementation

The smart contract utilizes a data structure called `Ticket` that contains all information related to a ticket:

- `date` of ticket purchase
- `Name` of the ticket purchaser
- `Surname` of the ticket purchaser
- `Matricola` of the user automatically assigned upon ticket purchase

Additionally, the smart contract mainly uses two arrays and a dictionary:

- `uint256[] LotteryParticipants;`
    - This array stores the matricolas of users who have purchased tickets * the number of tickets purchased.
        
        Example: Luca bought 3 tickets, while Marina bought 1 ticket.
        
        | Id(Luca) | Id(Luca) | Id(Luca) | Id(Marina) |
        | --- | --- | --- | --- |
- `uint256[] LotteryKey;`
    - Simply contains all the participant ids.
- `mapping(uint256 => Ticket) LotteryFeed;`
    - Within `LotteryFeed`, each id is mapped to the information of the user who bought the ticket.

The available functions within the smart contract are as follows:

- `getLastTicketSold()`
    - Every time a ticket is sold, the variable `last` is updated with the id generated for that ticket. This variable is then used to retrieve the last sold ticket's information from `LotteryFeed`.
    - This function can only be executed by the owner of the contract.
- `GetNumOfParticipants()`
    - Returns the length of `LotteryKey`. Anyone can execute this function.
- `GetAllParticipants()`
    - Iterates over the length of `LotteryKey`, saving the result of `LotteryFeed[LotteryKey[i]]` in an array.
    - This function can only be executed by the owner of the contract.
- `removeIndex()`
    - Called by `Extraction()` to swap positions between the matricola at index `randNo` and the matricola at index `lastItem`. The value of `LotteryPartecipants[randNo]` is saved in `winner`, and then `LotteryPartecipants.pop()` is performed.
- `Extraction()`
    - Assigns a random value between 0 and `LotteryPartecipants.length` to `randNo`, increments `randNonce` to change the seed, and then calls `removeIndex()`.
    - This function can only be executed by the owner of the contract.
- `Winner()`
    - Retrieves `LotteryFeed[winner]`.
    - This function can only be executed by the owner of the contract.
- `SellTicket()`
    - Requires that `name` and `surname` be greater than 0 characters but less than 256 characters, the `NumOfTickets` purchased is >0 and <100 and the user `id` is >0 and <1000.
    - `SellTicket` takes in in put the **`name, surname`** and the `**id**`
        
        if the id doesn’t exist in Lottery feed then is added to it, and add for the NumOfTicket the id in LotteryPartecipants, otherwise we don’t need to add in LotteryFeed the id because it already exists and we simply add in LotteryPartecipants the id x NumOfTickets
        
    - This function can only be executed by the owner of the contract.
- `closeLottery()`
    - Empties the following variables and arrays:
        - `writers;`
        - `LotteryFeed`
        - `LotteryParticipants;`
        - `id;`
        - `last;`
        - `LotteryKey;`
        - `winner;`
        - `randNo;`
        - `randNonce;`
    - This function can only be executed by the owner of the contract.
    
    ## Front-end Implementation
    
    The implementation of the front-end is strongly based from this guide .
    
    As frontend Framework I use React and as provider I use Infura instead of Alchemy.
    
    I put the InfuraProvider inside a .env file, in order to hide my API key.
    
    [Integrate Your Smart Contract With a Frontend](https://www.web3.university/tracks/create-a-smart-contract/integrate-your-smart-contract-with-a-frontend)
