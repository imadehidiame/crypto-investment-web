function profit(num=2000,perc=2.5,duration=30){
    let test_num = 0;
    for (let index = 0; index < duration; index++) {
        test_num+=((2.5/100) * num);
    }
    return {test_num,num:num+test_num};
}