let challengeContents = [];

class Challenge {
    question = '';
    answer = '';
    tip = '';

    constructor(question, answer, tip) {
        this.question = question;
        this.answer = answer;
        this.tip = tip;  
    }
}

export function createChallenge(question, answer, tip){
 challengeContents.push(new Challenge(question, answer, tip));
 localStorage.setItem('challengeContents' , JSON.stringify(challengeContents));
}
