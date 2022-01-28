let init = {
  yearsCount: 0, firstmonthCount: 0,
  secondMonthCount: 0, daysCount: 0,
  counter: 0, num: 367
}

while(init.num > 0){
  if (init.num >= 365){
    init.yearsCount += 1;
    init.num -= 365;
  }
  else if(init.num >= 31 && init.counter < 7){
    init.secondMonthCount += 1;
    init.num -= 31;
  }
  else if(init.num >= 30 && init.counter >= 7){
    init.firstmonthCount += 1;
    init.num -= 30;
  }
  else{
    init.daysCount = init.num;
    init.num -= init.num;
  }
}

console.log({years: init.yearsCount,
              month: init.firstmonthCount + init.secondMonthCount,
              days: init.daysCount})
