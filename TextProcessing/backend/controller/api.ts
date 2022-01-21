import { Request, Response, NextFunction} from 'express';
import TextProcessing from '../utils/helper'

const getKeywords = (keywordString: string) => {
    let flag = false;
    let characters = keywordString.split('');

    for (let i = 0; i < characters.length ; i ++) {
        if (!flag && (characters[i] === `"` || characters[i] === `'`)) {
            flag = true;
        } else if (flag && (characters[i] === `"` || characters[i] === `'`)) {
            flag = false;
        }
        if (flag && characters[i] === " ") {
            characters[i] = "+";
        }
        if (characters[i] === ",") {
            characters[i] = " ";
        }
    }
    let changedStr = characters.join("");
    let words = changedStr.split(/[\s]+/);
    return words
}

const changeText = async (req: Request, res: Response ) => {
    let keywordString = req.body.keywords;
    let origin = req.body.origin;

    let keywords: Array<string> = getKeywords(keywordString)
    
    let processor = new TextProcessing(false);

    keywords.map((keyword) => {
        processor.addKeyword(keyword, 'xxxx');
    })

    let replacedText = processor.replaceKeywords(origin);
    console.log('Replaced Text: ', replacedText);
    
    res.status(200).json({
        text: replacedText
    })
    
}

export default changeText;