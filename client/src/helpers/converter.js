import { utils, BigNumber, FixedNumber, } from 'ethers';

// Price = ratio (quote amount / base amount ) = units of quote to get one unit of base
// Example:  (base) BTC - USD (quote) price = $25000 => 25000 units of USD per unit of BTC
// Therefore:
//      ### Quote amount = price * base amount ###
//      ### Base amount = quote amount / price ###

// Before doing the currency conversion, the units of the input token
// are be converted from wei units to decimal units

// This function takes an input amount of base token in Wei, the price of the pair and
// outputs the countervalue in quote token in decimals
export const getQuoteAmount = (baseAmountWei, price, baseDecimals) => {
    const baseAmount = convertFromWei(baseAmountWei, baseDecimals);
    const quoteAmount = baseAmount * price;
    return quoteAmount;
}

// This function takes an input amount of quote token in Wei, the price of the pair and
// outputs the countervalue in base token in decimals
export const getBaseAmount = (quoteAmountWei, price, quoteDecimals) => {
    const quoteAmount = convertFromWei(quoteAmountWei, quoteDecimals);
    const baseAmount = quoteAmount/price;
    return baseAmount;
}

export function convertToWei(amount, decimals) {
    const amountWei = utils.parseUnits(amount.toString(), decimals);
    return amountWei;
}
  
export function convertFromWei(amount, decimals) {
    const outputAmount = utils.formatUnits(amount, decimals);
    return outputAmount;
}

function getDenomination(decimals) {
    let denomination;

    switch(decimals) {
        case 3:
            denomination = 'Kwei';
            break;
        
        case 6: 
            denomination = 'Mwei';
            break;

        case 9:
            denomination = 'Gwei';
            break;
        
        case 12:
            denomination = 'szabo';
            break;

        case 15:
            denomination = 'finney';
            break;

        case 18:
            denomination = 'ether';
            break;

        default:
            denomination = noDenomination;
    }
    return denomination;
}

function isCorrectNumber(number) {
    try {
        let output = new BigNumber(number);
        if(output.e === null && output.c === null) {
            throw('Error converting number');
        }
    } catch {
        return false;
    }
    return true;
}

/* const checkTrailingZeroes = (amount) => {
    let counter = 0
    for(counter = 0; counter < amount.length; counter += 1) {
        const zeroesString = ''.padEnd(counter + 1, '0');
        if(!amount.endsWith(zeroesString)) {
            break;
        }
    }
    return counter;
} */

/* export const getQuoteAmount = (baseAmountWei, price, baseDecimals, quoteDecimals) => {

    // Creating fixed number instances
    const baseAmountZeroes = checkTrailingZeroes(baseAmountWei.toString());
    const minZeroes = Math.min(baseAmountZeroes, baseDecimals, quoteDecimals);

    const baseAmountShifted = baseAmountWei.toString().slice(0,baseAmountWei.toString().length - minZeroes)

    const priceFN = price.toString().includes('.') ? price.toString() : price.toString() + '.0'; // 1000.0
    const [integerNumber, decimalNumber] = priceFN.toString().split('.');
    const priceShifted = integerNumber + decimalNumber.padEnd(minZeroes,'0').slice(0, minZeroes)

    // If base decimals are equal or greater than quote decimals, 
    // the base amount is multiplied by the price
    if( baseDecimals >= quoteDecimals) {
        const counterValueBaseBN = BigNumber.from(baseAmountShifted).mul(BigNumber.from(priceShifted));
        const counterValueQuoteBN = (counterValueBaseBN
                                    .mul(BigNumber.from('1'.padEnd(quoteDecimals + 1, '0'))))
                                    .div(BigNumber.from('1'.padEnd(baseDecimals + 1, '0')));
        // const [counterValueQuoteWei] = counterValueQuoteBN.toString().split('.');
        const counterValueQuote = convertFromWei(counterValueQuoteBN, quoteDecimals);
        const test = FixedNumber.from('0.001')
        return counterValueQuote;
    } else {
        const counterValueBaseBN = (BigNumber.from(baseAmountShifted)
                                    .mul(BigNumber.from('1'.padEnd(quoteDecimals + 1, '0'))))
                                    .div(BigNumber.from('1'.padEnd(baseDecimals + 1, '0')));
        // const counterValueBaseFN = FixedNumber.from(counterValueBaseBN.toString());
        const counterValueQuoteBN = counterValueBaseBN.mul(BigNumber.from(priceShifted));
        const counterValueQuote = convertFromWei(counterValueQuoteBN, quoteDecimals);
        const test = FixedNumber.from('0.001')
        return counterValueQuote;
    }
} */


/* export const getBaseAmount = (quoteAmountWei, price, baseDecimals, quoteDecimals) => {
    // Ex1: 1000000000 USDT ($1000) , WETHUSD price = 1000 , 18 , 6
    
    // Creating fixed number instances
    const quoteAmountZeroes = checkTrailingZeroes(quoteAmountWei.toString()); // 9 zeroes
    const minZeroes = Math.min(quoteAmountZeroes, baseDecimals, quoteDecimals); // 6 zeroes

    const quoteAmountShifted = quoteAmountWei.toString().padEnd(quoteAmountWei.toString().length + minZeroes, '0'); // 1000

    const priceFN = price.toString().includes('.') ? price.toString() : price.toString() + '.0'; // 1000.0
    
    const [integerNumber, decimalNumber] = priceFN.toString().split('.'); //['1000','0']
    const priceShifted = integerNumber + decimalNumber.padEnd(minZeroes,'0').slice(0, minZeroes); // '1000 + 000000'

    // If quote decimals are equal or greater than base decimals, 
    // the quote amount is divided by the price
    if( quoteDecimals >= baseDecimals) {
        const counterValueQuoteBN = BigNumber.from(quoteAmountShifted).div(BigNumber.from(priceShifted)); // 0.0000001
        const counterValueBaseBN = (counterValueQuoteBN
                                    .mul(BigNumber.from('1'.padEnd(baseDecimals + 1, '0'))))
                                    .div(BigNumber.from('1'.padEnd(quoteDecimals + 1, '0')));
        // const [counterValueQuoteWei] = counterValueQuoteBN.toString().split('.');
        const counterValueBase = convertFromWei(counterValueBaseBN, baseDecimals);
        return counterValueBase;
    } else {
        const counterValueQuoteBN = (BigNumber.from(quoteAmountShifted)   
                                    .mul(BigNumber.from('1'.padEnd(baseDecimals + 1, '0'))))  
                                    .div(BigNumber.from('1'.padEnd(quoteDecimals + 1, '0'))); // 1000 *1000000000000
        // const counterValueBaseFN = FixedNumber.from(counterValueBaseBN.toString());
        const counterValueBaseBN = counterValueQuoteBN.div(priceShifted); // 1000000000000000 / 1000000000 = 1000000
        const counterValueBase = convertFromWei(counterValueBaseBN, baseDecimals); 
        return counterValueBase;
    }
} */