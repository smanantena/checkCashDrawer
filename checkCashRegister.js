function checkCashRegister(price, cash, cid) {
    let change;
    const currencyUnitListReversed = [["PENNY", 0.01], ["NICKEL", 0.05], ["DIME", 0.1], ["QUARTER", 0.25], ["ONE", 1], ["FIVE", 5], ["TEN", 10], ["TWENTY", 20], ["ONE HUNDRED", 100]].reverse().map(
        item => [item[0], item[1] * 100]
    );
    //console.log("currencyUnitListReversed",currencyUnitListReversed);
    
    const cidReversed = cid.reverse().map( item => [item[0], item[1] * 100] );
    change = changeValue(price * 100, cash * 100);
    let amountList = amountReturn(change, currencyUnitListReversed, cidReversed);
    let state = checkStateOfDrawer(change, amountList, cidReversed);
    amountList = amountList.map(
        item => [item[0], item[1]/100]
    );
    return {"status":state, "change": finalChangeList(state, amountList)};
}

//step 1 : compute change value
function changeValue(price, cash) {
    return cash - price;
}

//step 2 : compute amount return
function amountReturn(change, currencyUnitListReversed, cidReversed) {
    let result = [];
    let changeToCheck = change;
    currencyUnitListReversed.forEach(
        (item, index) => {
            let amount = computeAmountReturnSingle(changeToCheck, item[1], cidReversed[index][1]);
            let currencyChange = determineCurrencyChange(changeToCheck, item[1]);
            result.push(
                [
                   item[0], currencyChange ? amount : 0
                ]
            );
            if(currencyChange) {
                changeToCheck = changeToCheck - amount ;
            }
            //console.log("changeToCheck", changeToCheck );
        }
    )
    return result;
}

//step 2.1 : determine if currency consist of change
function determineCurrencyChange(changeToCheck, currencyUnit) {
    
    return Math.trunc(changeToCheck / currencyUnit) > 0;
}

//step 2.2 : compute amount to return for single currency
function computeAmountReturnSingle(changeToCheck, currencyUnit, cidItem) {
    let result;
    let numMax = Math.trunc(changeToCheck / currencyUnit);
    let numCurrCID = Math.trunc(cidItem / currencyUnit);
    let numToChoose =  numMax <= numCurrCID ? numMax : numCurrCID;
    result = numToChoose * currencyUnit;
    return result;
}

//step 3 : check state of drawer
function checkStateOfDrawer(change, amountList, cidReversed) {
    let result;
    let amountSum = amountList.map(
        item => item[1]
    ).reduce(
        (accumulator, item) => {
            return accumulator + item;
        }
    );
    let cidSum = cidReversed.map(
        item => item[1]
    ).reduce(
        (accumulator, item) => {
            return accumulator + item;
        }
    );
    
    console.log("change", change, "amountSum", amountSum, "cidSum", cidSum);
    if(change == amountSum) {
        if(amountSum < cidSum) {
            console.log("Status:" ,"OPEN");
            result = "OPEN";
        } else if(amountSum == cidSum) {
            console.log("Status:" ,"CLOSED");
            result = "CLOSED";
        }
    } else if(amountSum < change) {
        console.log("Status:" ,"INSUFFICIENT_FUNDS");
        result = "INSUFFICIENT_FUNDS";
    }

    return result;
}

//step 4 : final change list
function finalChangeList(state, amountList) {
    if(state == "INSUFFICIENT_FUNDS") {
        return [];
    } else if(state == "CLOSED") {
        return amountList.reverse();
    } else if(state == "OPEN") {
        return amountList.filter(
            item => item[1] > 0
        );
    }
}

console.log(checkCashRegister(19.5, 20, [["PENNY", 0.5], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]));