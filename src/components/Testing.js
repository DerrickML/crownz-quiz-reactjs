import React from "react";
import IframeComponent from "./IframeComponent";
// import results from "./english/EngResults";
import QuizResults from "./english/QuizResults";
import ExamPage from "./ExamPage";

function Testing() {
  const results2 = [
    { marksObtained: 0, totalMarks: 50, type: "finalMarks" },
    {
      instruction:
        "In each of the questions 1 to 5, fill in the blank space with a suitable word.",
      category: "fillBlank",
      questions: [
        {
          question:
            'The letter "e" appears <input type=\'text\'> in the word "Wednesday".',
          userAnswer: "",
          correctAnswer: "twice",
          marks: 0,
        },
        {
          question:
            "Mum's <input type='text'> took place in her home village last Saturday.",
          userAnswer: "",
          correctAnswer: "marriage",
          marks: 0,
        },
        {
          question:
            "The dog <input type='text'> so loudly that everybody got scared.",
          userAnswer: "",
          correctAnswer: "barked",
          marks: 0,
        },
        {
          question: "<input type='text'> of these pens belongs to you?",
          userAnswer: "",
          correctAnswer: "Which",
          marks: 0,
        },
        {
          question:
            "Our class teacher is such a kind man <input type='text'> we all love.",
          userAnswer: "",
          correctAnswer: "who",
          marks: 0,
        },
      ],
    },
    {
      instruction:
        "In each of the questions 6 to 15, use the correct form of the word given in the brackets to complete the sentence.",
      category: "givenBlank",
      questions: [
        {
          question:
            "He got lost because he had <input type='text'> the way to the clinic. (forget)",
          userAnswer: "",
          correctAnswer: "forgotten",
          marks: 0,
        },
        {
          question:
            "Our class prefect is a very <input type='text'> girl. (beauty)",
          userAnswer: "",
          correctAnswer: "beautiful",
          marks: 0,
        },
        {
          question:
            "The triplets opened the door by <input type='text'> .(them)",
          userAnswer: "",
          correctAnswer: "themselves",
          marks: 0,
        },
        {
          question: "John bought a <input type='text'> bed for himself. (wood)",
          userAnswer: "",
          correctAnswer: "wooden",
          marks: 0,
        },
        {
          question:
            "There will be a <input type='text'> ceremony in our village tomorrow. (bury)",
          userAnswer: "",
          correctAnswer: "burial",
          marks: 0,
        },
        {
          question:
            "The boy who got the <input type='text'> mark was not promoted to the next class. (little)",
          userAnswer: "",
          correctAnswer: "least",
          marks: 0,
        },
        {
          question:
            "How many <input type='text'> did Mr. Bukenya have in his farm? (sheep)",
          userAnswer: "",
          correctAnswer: "sheep",
          marks: 0,
        },
        {
          question:
            "Of the two boys, Tom is the <input type='text'> . (clever)",
          userAnswer: "",
          correctAnswer: "cleverer",
          marks: 0,
        },
        {
          question:
            "The community member repaired the bridge <input type='text'> .(voluntary)",
          userAnswer: "",
          correctAnswer: "voluntarily",
          marks: 0,
        },
        {
          question:
            "Warm clothes are <input type='text'> by people in cold areas. (wear)",
          userAnswer: "",
          correctAnswer: "worn",
          marks: 0,
        },
      ],
    },
    {
      instruction:
        "In each of the questions 16 to 17, drag and drop the given words in alphabetical order.",
      category: "alphabetical",
      questions: [
        {
          question: "Arrange words: different, distance, difficult, diffuse",
          userAnswer: "",
          correctAnswer: "difficult, diffuse, different, distance",
          marks: 0,
        },
        {
          question: "Arrange words: turkey, dove, pigeon, eagle",
          userAnswer: "",
          correctAnswer: "dove, eagle, pigeon, turkey",
          marks: 0,
        },
      ],
    },
    {
      instruction:
        "In each of the questions 18 to 20, give one word for the underlined group of words.",
      category: "underlined",
      questions: [
        {
          question: "The figure is <u> shaped in form of a circle. </u>",
          userAnswer: "",
          correctAnswer: "circular",
          marks: 0,
        },
        {
          question: "There were many <u> sick people </u> in the hospital.",
          userAnswer: "",
          correctAnswer: "patients",
          marks: 0,
        },
        {
          question:
            "The class monitor has put up the <u> list of responsibilities to be done and the class members to do them. </u>",
          userAnswer: "",
          correctAnswer: "rotter",
          marks: 0,
        },
      ],
    },
    {
      instruction:
        "In each of the questions 21 to 22, choose the sentence where the given word is used correctly.",
      category: "multiple_choice",
      questions: [
        {
          question: "brake",
          userAnswer: "",
          correctAnswer: "I need to brake for the stop sign.",
          marks: 0,
        },
        {
          question: "meat",
          userAnswer: "",
          correctAnswer: "Dad bought some fresh meat from the butcher.",
          marks: 0,
        },
      ],
    },
    {
      instruction:
        "In each of the questions 23 to 24, write the full form of the given abbreviation.",
      category: "abbreviation",
      questions: [
        { question: "vs", userAnswer: "", correctAnswer: "versus", marks: 0 },
        {
          question: "cc",
          userAnswer: "",
          correctAnswer: "carbon copy",
          marks: 0,
        },
      ],
    },
    {
      instruction:
        "In each of the questions 25 to 26, drag and drop the given words to from a sentence.",
      category: "sentence",
      questions: [
        {
          question: "Arrange words: beautiful, sunset., I, a, see",
          userAnswer: "see, sunset., beautiful, I, a",
          correctAnswer: "I, see, a, beautiful, sunset.",
          marks: 0,
        },
        {
          question: "Arrange words: help., some, need, I",
          userAnswer: "",
          correctAnswer: "I, need, some, help.",
          marks: 0,
        },
      ],
    },
    {
      instruction:
        "In each of the questions 27 to 28, give the opposite of the underlined word(s) or given word.",
      category: "opposite",
      questions: [
        {
          question: "The city is full of <u>ancient</u> buildings.",
          userAnswer: "",
          correctAnswer: "modern",
          marks: 0,
        },
        {
          question: "The <u>bestman</u> looked smart during the wedding.",
          userAnswer: "",
          correctAnswer: "matron",
          marks: 0,
        },
      ],
    },
    {
      instruction:
        "In each of the questions 29 to 30, give the plural of the underlined or given word(s).",
      category: "plural",
      questions: [
        { question: "hero", userAnswer: "", correctAnswer: "heroes", marks: 0 },
        {
          question: "ream of paper",
          userAnswer: "",
          correctAnswer: "reams of paper",
          marks: 0,
        },
      ],
    },
    {
      instruction:
        "In each of the questions 31 to 50, select the sentence with the correct rewritten option according to the instruction provided in the brackets.",
      category: "rewriteMultiplechoice",
      questions: [
        {
          question:
            "Playing netball is interesting. Playing football is very interesting. (Rewrite as one sentence using:….more….than…)",
          userAnswer: "",
          correctAnswer:
            "Playing football is more interesting than playing netball.",
          marks: 0,
        },
        {
          question:
            "I have to pass this examination highly. (Rewrite the sentence using ………………must …………………)",
          userAnswer: "",
          correctAnswer: "I must pass this examination highly.",
          marks: 0,
        },
        {
          question:
            "The police didn't have handcuffs. The police didn't arrest the thief. (Rewrite as one sentence beginning: If………………)",
          userAnswer: "",
          correctAnswer:
            "If  the police had had handcuffs, they would have arrested the thief.",
          marks: 0,
        },
        {
          question:
            "The mechanic repaired my father’s car. (Rewrite the sentence and end: …………by the mechanic.)",
          userAnswer: "",
          correctAnswer: "My father’s car was repaired by the mechanic.",
          marks: 0,
        },
        {
          question:
            "The priest will pray with the orphans. The priest will pray with the widow. (re-write as one sentence using…………both…………)",
          userAnswer: "",
          correctAnswer:
            "The priest will pray with both the orphans and widow.",
          marks: 0,
        },
        {
          question:
            "What children need is to observe rules and regulations. (Rewrite the sentence beginning: Children….)",
          userAnswer: "",
          correctAnswer: "Children should observe rules and regulations.",
          marks: 0,
        },
        {
          question:
            "I am not a cat. I will not hunt for rats. (Rewrite as one sentence beginning: If….)",
          userAnswer: "",
          correctAnswer: "If I were a cat, I would hunt for rats.",
          marks: 0,
        },
        {
          question:
            "Immediately mother reached home, the guest of honour had spoken. (Re-write sentence beginning: No sooner…………)",
          userAnswer: "",
          correctAnswer:
            "The audience was excited after the guest of honor's speech.",
          marks: 0,
        },
        {
          question:
            "Fighting fellow pupils is bad. (Rewrite the sentence beginning: To….)",
          userAnswer: "",
          correctAnswer: "To fight fellow pupils is bad.",
          marks: 0,
        },
        {
          question:
            "There was no charcoal in the store. Mother managed to prepare supper. (Rewrite as one sentence using: Much as ....)",
          userAnswer: "",
          correctAnswer:
            "Much as there was no charcoal in the store, Mother managed to prepare supper.",
          marks: 0,
        },
        {
          question:
            "Nancy is a hard-working girl. Jane is also a hard-working girl.(Rewrite as one sentence using …………both……………)",
          userAnswer: "",
          correctAnswer: "Nancy and Jane are both hard-working girls.",
          marks: 0,
        },
        {
          question:
            "Beda Junior was sewing. The needle pricked him. (Rewrite as one sentence using: …………while…………)",
          userAnswer: "",
          correctAnswer: "The needle pricked Benda junior while he was sewing.",
          marks: 0,
        },
        {
          question:
            "Peter should wear a school uniform. He should tuck in his shirt. (Rewrite as one sentence beginning: Not only.....)",
          userAnswer: "",
          correctAnswer:
            "Not only should Peter wear a school uniform, he should also tuck in his shirt.",
          marks: 0,
        },
        {
          question:
            "Jatel has borrowed my mathematical set. (Rewrite the sentence beginning: I.......)",
          userAnswer: "",
          correctAnswer: "I have lent my mathematical set to Jatel.",
          marks: 0,
        },
        {
          question:
            "The journalist needn’t have written false reports.(Rewrite the sentence using …………necessary………………)",
          userAnswer: "",
          correctAnswer:
            "It was not necessary for the Journalist to write false report.",
          marks: 0,
        },
        {
          question:
            "Here is the boy. His photograph appeared in the newspaper. (Rewrite as one sentence using: ....whose....)",
          userAnswer: "",
          correctAnswer:
            "Here is the boy whose photograph appeared in the newspaper.",
          marks: 0,
        },
        {
          question:
            "Jeremiah is a disciplined boy so is Jesse. (Re- write the sentence beginning Both…)",
          userAnswer: "",
          correctAnswer: "Both Jesse and Jeremiah are disciplined boys.",
          marks: 0,
        },
        {
          question:
            "Jacob and James like biscuits more than buns. (Re-write sentence using …….prefer….)",
          userAnswer: "",
          correctAnswer: "Jacob and James prefer biscuit to burns.",
          marks: 0,
        },
        {
          question:
            "None of the garments was clean. (Rewrite the sentence beginning: All………………)",
          userAnswer: "",
          correctAnswer: "All the garments were dirty.",
          marks: 0,
        },
        {
          question:
            "My little sister is very ill. She can’t eat any food. (Rewrite as one sentence using: ………so……that………)",
          userAnswer: "",
          correctAnswer:
            "My little sister is so ill that she can’t eat any food.",
          marks: 0,
        },
      ],
    },
    {
      type: "iframeResults",
      data: [
        [
          {
            story:
              '\n   <div class="instruction">\n    Read the passage below and then answer the questions that follow in full sentences.\n   </div>\n   <div class="story">\n    <p>\n     Matilida is the daughter of Bulasio, the well known bicycle repairer in the village. She is the fourth child in the family. \n            In august this year. Matilida turned twelve; she is now in P.7.\n    </p>\n    <p>\n     Each day, during the school term. Matilida walks to school, a distance of nearly three kilometers from home.\n            She does so with many other children in the village. They have to walk fast and sometimes run to be in time \n            for the school compound. Matilida and her friends have begun each day like this since they were in P.1. \n            They do it without complaining because they know that general cleaning of the school is part of the\n     <u>\n      daily routine.\n     </u>\n    </p>\n    <p>\n     One day after school, Matilida and her friends started walking back home. They had just gone beyond the local market\n            when it started raining heavily, but they continued their journey home. They got worried about their books becoming \n            wet because each one of them carried her books in a small polythene bag. As it continued raining heavily, Matilida\n            and her friends started running. Matilida was ahead of the others, showing them where to pass on the wet ground.\n            As they passed near a small rock. Matilida slipped on one hidden in a pool of water and fell with all her books. \n            It was still raining heavily. Everyone stopped to help her. She was all covered in mud. She was lucky that the \n            polythene big was properly tied. Minutes later, it stopped raining.\n    </p>\n    <p>\n     They now decided to walk slowly and as they reached their village, each took the path to her home. When Matilida \n            reached home, her mother was unhappy to see her looking like a\n     <u>\n      ghost.\n     </u>\n     She helped her to change her clothes.\n    </p>\n    <p>\n     Afterwards Matilida pulled out everything from her polythene bag. She noticed that her pen and pencil were missing.\n            They must have fallen in the pool. Then she saw a hole in her polythene bag! Although it started raining heavily again. \n            Matilida decided to run back to the place where she had fallen in the pool of water.\n    </p>\n   </div>\n   <div class="questions-container">\n    <ol id="questions-list" type="a">\n    <li><span class="question-number"></span> How old is Matilida?<div><label><input type="radio" name="question-0" value="Matilida is ten years old.">Matilida is ten years old.</label><label><input type="radio" name="question-0" value="Matilida is eleven years old.">Matilida is eleven years old.</label><label><input type="radio" name="question-0" value="Matilida is twelve years old.">Matilida is twelve years old.</label></div><span class="cross">✗</span><span class="correct-answer">Correct answer: Matilida is twelve years old.</span></li><li><span class="question-number"></span> How does Matilida get to school early?<div><label><input type="radio" name="question-1" value="Matilida is driven to school each day.">Matilida is driven to school each day.</label><label><input type="radio" name="question-1" value="Matilida walks to school each day.">Matilida walks to school each day.</label><label><input type="radio" name="question-1" value="Matilida rides to school each day.">Matilida rides to school each day.</label></div><span class="cross">✗</span><span class="correct-answer">Correct answer: Matilida walks to school each day.</span></li><li><span class="question-number"></span> Give a reason why Matilida and her friends have to reach the school early.<div><label><input type="radio" name="question-2" value="They to reach school early because general cleaning of the school is part of their daily routine.">They to reach school early because general cleaning of the school is part of their daily routine.</label><label><input type="radio" name="question-2" value="They have to reach school early because she does not want to be late.">They have to reach school early because she does not want to be late.</label></div><span class="cross">✗</span><span class="correct-answer">Correct answer: They to reach school early because general cleaning of the school is part of their daily routine.</span></li><li><span class="question-number"></span> Why did Matilida and her friends start running home after school?<div><label><input type="radio" name="question-3" value="They started running home after school because they did not want to get home early.">They started running home after school because they did not want to get home early.</label><label><input type="radio" name="question-3" value="They started running home after school because it started raining heavily.">They started running home after school because it started raining heavily.</label><label><input type="radio" name="question-3" value="They started running home after school because they were hurrying to watch cartoons.">They started running home after school because they were hurrying to watch cartoons.</label></div><span class="cross">✗</span><span class="correct-answer">Correct answer: They started running home after school because it started raining heavily.</span></li><li><span class="question-number"></span> Why did Matilida fall into the pool of water?<div><label><input type="radio" name="question-4" value="Matilida fell into the pool of water because she wanted to swim.">Matilida fell into the pool of water because she wanted to swim.</label><label><input type="radio" name="question-4" value="Matilida fell into the pool of water because her friends pushed her.">Matilida fell into the pool of water because her friends pushed her.</label><label><input type="radio" name="question-4" value="Matilida fell into the pool of water because she slipped on a hidden rock.">Matilida fell into the pool of water because she slipped on a hidden rock.</label></div><span class="cross">✗</span><span class="correct-answer">Correct answer: Matilida fell into the pool of water because she slipped on a hidden rock.</span></li><li><span class="question-number"></span> How did her friends show that they loved Matilida?<div><label><input type="radio" name="question-5" value="They stopped to help her when she fell.">They stopped to help her when she fell.</label><label><input type="radio" name="question-5" value="They shared their breakfast with her.">They shared their breakfast with her.</label></div><span class="cross">✗</span><span class="correct-answer">Correct answer: They stopped to help her when she fell.</span></li><li><span class="question-number"></span> Suggest a suitable TITLE for this passage.<div><label><input type="radio" name="question-6" value="Matilida\'s Rainy Day.">Matilida\'s Rainy Day.</label><label><input type="radio" name="question-6" value="Friends">Friends</label><label><input type="radio" name="question-6" value="Rainy season.">Rainy season.</label></div><span class="cross">✗</span><span class="correct-answer">Correct answer: Matilida\'s Rainy Day.</span></li><li class="main">Give another word or a group of words with the same meaning as each of the underlined words in the passage.<ul><li class="subs">daily routine.<input type="text" placeholder="Type your answer here"><span class="cross">✗</span><span class="correct-answer">Correct answers: regular habit, routine schedule, everyday practice</span></li><li class="subs">ghost<input type="text" placeholder="Type your answer here"><span class="cross">✗</span><span class="correct-answer">Correct answers: spirit, spook, apparition, specter</span></li></ul></li></ol>\n   </div>\n  ',
            totalMarks: 0,
          },
        ],
        [
          {
            story:
              '\n        <div id="questionImage">\n            <div class="instruction">The information below shows a page of a p.3 class register of teacher Namiiro\n                Theopista,\n                Buzzy primary school. Study it carefully and then answer in full sentences the questions that follow.\n            </div>\n            <div class="image">\n                <img src=".\\image\\2014_52.png" alt="PLE">\n            </div>\n        </div>\n        <div class="questions-container">\n            <ol id="questions-list" type="a">\n            <li><span class="question-number"></span> Which teacher used the above register?<div><label><input type="radio" name="question-0" value="Teacher  Agaba Joseph used the above register.">Teacher  Agaba Joseph used the above register.</label><label><input type="radio" name="question-0" value="Teacher Namiiro Theopista used the above register.">Teacher Namiiro Theopista used the above register.</label><label><input type="radio" name="question-0" value="Apendi Stacy Theopista used the above register.">Apendi Stacy Theopista used the above register.</label></div><span class="cross">✗</span><span class="correct-answer">Correct answer: Teacher Namiiro Theopista used the above register.</span></li><li><span class="question-number"></span> In which school was the register used?<input type="text" placeholder="Type your answer here"><span class="cross">✗</span><span class="correct-answer">Correct answer: Buzzy primary school</span></li><li><span class="question-number"></span> Who is the youngest boy in the class?<div><label><input type="radio" name="question-2" value="The youngest boy is Ichat Mark.">The youngest boy is Ichat Mark.</label><label><input type="radio" name="question-2" value="The youngest boy is Bazira Byron.">The youngest boy is Bazira Byron.</label><label><input type="radio" name="question-2" value="The youngest boy is Waiswa Bruno.">The youngest boy is Waiswa Bruno.</label></div><span class="cross">✗</span><span class="correct-answer">Correct answer: The youngest boy is Waiswa Bruno.</span></li><li><span class="question-number"></span> Which pupil had the poorest attendance in class?<div><label><input type="radio" name="question-3" value="Bazira Byron has the poorest attendance in class.">Bazira Byron has the poorest attendance in class.</label><label><input type="radio" name="question-3" value="Walugonza Brian has the poorest attendance in class.">Walugonza Brian has the poorest attendance in class.</label><label><input type="radio" name="question-3" value="Namukuya Brenda has the poorest attendance in class.">Namukuya Brenda has the poorest attendance in class.</label></div><span class="cross">✗</span><span class="correct-answer">Correct answer: Bazira Byron has the poorest attendance in class.</span></li><li><span class="question-number"></span> Who was absent in the morning but present in the afternoon?<div><label><input type="radio" name="question-4" value="Agaba Joseph was absent in the morning but present in the afternoon.">Agaba Joseph was absent in the morning but present in the afternoon.</label><label><input type="radio" name="question-4" value="Apendi Stacy was absent in the morning but present in the afternoon.">Apendi Stacy was absent in the morning but present in the afternoon.</label><label><input type="radio" name="question-4" value="Bazira Byron was absent in the morning but present in the afternoon.">Bazira Byron was absent in the morning but present in the afternoon.</label></div><span class="cross">✗</span><span class="correct-answer">Correct answer: Apendi Stacy was absent in the morning but present in the afternoon.</span></li><li><span class="question-number"></span> On which day did the pupils go for holidays?<input type="text" placeholder="Type your answer here"><span class="cross">✗</span><span class="correct-answer">Correct answer: Friday</span></li><li><span class="question-number"></span> How many pupils were present on Monday of the first week?<div><label><input type="radio" name="question-6" value="Twelve pupils were present on Monday of the first week.">Twelve pupils were present on Monday of the first week.</label><label><input type="radio" name="question-6" value="Fourteen pupils were present on Monday of the first week.">Fourteen pupils were present on Monday of the first week.</label><label><input type="radio" name="question-6" value="Eleven pupils were present on Monday of the first week.">Eleven pupils were present on Monday of the first week.</label></div><span class="cross">✗</span><span class="correct-answer">Correct answer: Twelve pupils were present on Monday of the first week.</span></li><li><span class="question-number"></span> Who is the last pupil shown in the register?<div><label><input type="radio" name="question-7" value="Bazira Byron is the last pupil shown in the register.">Bazira Byron is the last pupil shown in the register.</label><label><input type="radio" name="question-7" value="Mutasa Aggrey is the last pupil shown in the register.">Mutasa Aggrey is the last pupil shown in the register.</label><label><input type="radio" name="question-7" value="Walugonza Brian is the last pupil shown in the register.">Walugonza Brian is the last pupil shown in the register.</label></div><span class="cross">✗</span><span class="correct-answer">Correct answer: Walugonza Brian is the last pupil shown in the register.</span></li><li><span class="question-number"></span> How many pupils were never absent?<div><label><input type="radio" name="question-8" value="Five pupils were never absent.">Five pupils were never absent.</label><label><input type="radio" name="question-8" value="Three pupils were never absent.">Three pupils were never absent.</label><label><input type="radio" name="question-8" value="Six pupils were never absent.">Six pupils were never absent.</label></div><span class="cross">✗</span><span class="correct-answer">Correct answer: Three pupils were never absent.</span></li><li><span class="question-number"></span> On which day of the two weeks were all the pupils present?<div><label><input type="radio" name="question-9" value="They were all present on Tuesday.">They were all present on Tuesday.</label><label><input type="radio" name="question-9" value="They were all present on Friday.">They were all present on Friday.</label><label><input type="radio" name="question-9" value="They were all present on Wednesday.">They were all present on Wednesday.</label></div><span class="cross">✗</span><span class="correct-answer">Correct answer: They were all present on Tuesday.</span></li></ol>\n        </div>\n    ',
            totalMarks: 0,
          },
        ],
        [
          {
            story:
              '\n   <div class="instruction">\n    Below is a short passage of two paragraphs. Choose the correct option with the correctly puctuated passage.\n   </div>\n   <div class="passage">\n    <p>\n     during Janes successful party held at the main hall may people got drunk. i personally\n            ate a lot of meat and there were so many other things to eat. Among the many things\n            fish was not the best for me i had terrible diarrhea which made me very weak and sick.\n    </p>\n    <p>\n     asiimwe, my friend came to check on me on the following day.\n    </p>\n   </div>\n   <div class="questions-container" id="questions-container">\n   <div class="option"><input type="radio" name="passageOption" value="0" id="option0"><label for="option0"><p>\n        During Jane’s successful party held at the main hall, many people got drunk. I personally ate a lot of \n        meat and there were so many other things to eat Among the many things fish was not the best for me; \n        I had terrible diarrhea which made me very weak and sick.\n    </p>\n    <p>\n        asiimwe, my friend came to check on me on the following day.\n    </p></label></div><div class="option"><input type="radio" name="passageOption" value="1" id="option1"><label for="option1"><p>\n        During Jane\'s successful party held at the main hall, many people got drunk. \n        I personally ate a lot of meat, and there were so many other things to eat. Among \n        the many things, fish was not the best for me. I had terrible diarrhea, which made\n        me very weak and sick.\n    </p>\n    <p>\n        Asiimwe, my friend, came to check on me on the following day.\n    </p></label></div><div class="option"><input type="radio" name="passageOption" value="2" id="option2"><label for="option2"><p>\n        During Jane\'s successful party held at the main hall many people got drunk. I personally ate a lot of meat, \n        and there were so many other things to eat. Among the many things, fish was not the best for me I had\n        terrible diarrhea, which made me very weak and sick\n    </p>\n    <p>\n        Asiimwe, my friend, came to check on me on the following day.\n    </p></label></div><div class="correct-answer"><p>Correct Answer:</p><p>\n                            During Jane\'s successful party held at the main hall, many people got drunk. \n                            I personally ate a lot of meat, and there were so many other things to eat. Among \n                            the many things, fish was not the best for me. I had terrible diarrhea, which made\n                            me very weak and sick.\n                        </p>\n                        <p>\n                            Asiimwe, my friend, came to check on me on the following day.\n                        </p></div></div>\n  ',
            totalMarks: 0,
          },
        ],
        [
          {
            story:
              '\n   <div class="instruction">\n    The sentences below are not in the correct order. Drag and drop them\n      to form a short composition about “A health officer”\n   </div>\n   <div class="container">\n    <div class="drag-container" id="drag-container">\n    <div draggable="true" class="draggable-sentence" data-index="0">1. He requested the headteacher to allow him talk to the pupils about HIV/AIDS.</div><div draggable="true" class="draggable-sentence" data-index="1">2. The health officer explained to the pupils about the causes signs and symptoms of HIV/AIDS.</div><div draggable="true" class="draggable-sentence" data-index="2">3. Abstaining from sex and not sharing sharp objects was the answer he gave.</div><div draggable="true" class="draggable-sentence" data-index="3">4. Finally, the headboy thanked the health officer for the message on behalf of the pupils.</div><div draggable="true" class="draggable-sentence" data-index="4">5. One day, a health officer came to our school.</div><div draggable="true" class="draggable-sentence" data-index="5">6. He also advised pupils to avoid getting HIV/AIDS.</div><div draggable="true" class="draggable-sentence" data-index="6">7. And he went straight to the headteacher’s office.</div><div draggable="true" class="draggable-sentence" data-index="7">8. The headteacher welcomed him and gave him the visitor’s book to sign.</div><div draggable="true" class="draggable-sentence" data-index="8">9. She welcomed the health officer’s request and organized for an assembly.</div><div draggable="true" class="draggable-sentence" data-index="9">10. After his talk, one of the pupils asked him how HIV/AIDS could be avoided.</div></div>\n    <div class="drop-container" id="drop-container">\n    <div class="drop-placeholder">Drop the sentences here............</div></div>\n   </div>\n   <div class="result-container" id="result-container">Correct order: <div class="sentenceInOrder">1. One day, a health officer came to our school.</div><div class="sentenceInOrder">2. And he went straight to the headteacher’s office.</div><div class="sentenceInOrder">3. The headteacher welcomed him and gave him the visitor’s book to sign.</div><div class="sentenceInOrder">4. He requested the headteacher to allow him talk to the pupils about HIV/AIDS.</div><div class="sentenceInOrder">5. She welcomed the health officer’s request and organized for an assembly.</div><div class="sentenceInOrder">6. The health officer explained to the pupils about the causes signs and symptoms of HIV/AIDS.</div><div class="sentenceInOrder">7. He also advised pupils to avoid getting HIV/AIDS.</div><div class="sentenceInOrder">8. After his talk, one of the pupils asked him how HIV/AIDS could be avoided.</div><div class="sentenceInOrder">9. Abstaining from sex and not sharing sharp objects was the answer he gave.</div><div class="sentenceInOrder">10. This juncture marks the closure of one chapter and the commencement of another.</div></div>\n  ',
            totalMarks: 0,
          },
        ],
        [
          {
            story:
              '\n   <div class="instruction">\n    Drag and drop these sentences to form a composition about your plans after the Primary Leaving Examination.\n   </div>\n   <div class="container">\n    <div class="drag-container" id="drag-container">\n    <div draggable="true" class="draggable-sentence" data-index="0">In short, after my PLE, I will thank my teachers, have a fun party, help at home, and plan for more school.</div><div draggable="true" class="draggable-sentence" data-index="1">In the future, I will talk to my family about what school to go to next.</div><div draggable="true" class="draggable-sentence" data-index="2">After I know my grades, I\'m going to help my mom and dad at home.</div><div draggable="true" class="draggable-sentence" data-index="3">I just finished my Primary Leaving Examination, and I want to say a big thank you to my head teacher and teachers for helping me.</div><div draggable="true" class="draggable-sentence" data-index="4">We will laugh and be happy because I finished primary school.</div><div draggable="true" class="draggable-sentence" data-index="5">MY PLANS AFTER PRIMARY LEAVING EXAMINATION.</div><div draggable="true" class="draggable-sentence" data-index="6">They are the best!</div><div draggable="true" class="draggable-sentence" data-index="7">When I get my results, I\'m going to have a big party with my family and friends.</div><div draggable="true" class="draggable-sentence" data-index="8">I hope I get good grades in my PLE, and that will make my family and teachers really happy.</div><div draggable="true" class="draggable-sentence" data-index="9">I want to make their work easier because they helped me a lot.</div></div>\n    <div class="drop-container" id="drop-container">\n    <div class="drop-placeholder">Drop the sentences here............</div></div>\n   </div>\n   <div class="result-container" id="result-container">Correct order: <div class="sentenceInOrder">MY PLANS AFTER PRIMARY LEAVING EXAMINATION.</div><div class="sentenceInOrder">I just finished my Primary Leaving Examination, and I want to say a big thank you to my head teacher and teachers for helping me.</div><div class="sentenceInOrder">They are the best!</div><div class="sentenceInOrder">I hope I get good grades in my PLE, and that will make my family and teachers really happy.</div><div class="sentenceInOrder">After I know my grades, I\'m going to help my mom and dad at home.</div><div class="sentenceInOrder">I want to make their work easier because they helped me a lot.</div><div class="sentenceInOrder">When I get my results, I\'m going to have a big party with my family and friends.</div><div class="sentenceInOrder">We will laugh and be happy because I finished primary school.</div><div class="sentenceInOrder">In the future, I will talk to my family about what school to go to next.</div><div class="sentenceInOrder">In short, after my PLE, I will thank my teachers, have a fun party, help at home, and plan for more school.</div></div>\n  ',
            totalMarks: 0,
          },
        ],
      ],
    },
  ];
  const results = [
    {
      marksObtained: 4,
      totalMarks: 50,
      type: "finalMarks",
    },
    {
      instruction:
        "In each of the questions 1 to 5, fill in the blank space with a suitable word.",
      category: "fillBlank",
      questions: [
        {
          question:
            "<input type='text'> she works hard, she will not pass the examination.",
          userAnswer: "If",
          correctAnswer: "Unless",
          marks: 0,
        },
        {
          question: "How <input type='text'> does a bottle of soda cost?",
          userAnswer: "much",
          correctAnswer: "much",
          marks: 1,
        },
        {
          question:
            "That lady has <input type='text'> standing near the sign post.",
          userAnswer: "been",
          correctAnswer: "been",
          marks: 1,
        },
        {
          question: "Lazy peeple <input type='text'> eating to working.",
          userAnswer: "prefer",
          correctAnswer: "prefer",
          marks: 1,
        },
        {
          question: "Brenda has been crying <input type='text'> two hours.",
          userAnswer: "for",
          correctAnswer: "for",
          marks: 1,
        },
      ],
    },
    {
      instruction:
        "In each of the questions 6 to 15, use the correct form of the word given in the brackets to complete the sentence.",
      category: "givenBlank",
      questions: [
        {
          question:
            "Woolen clothes are mostly <input type='text'> by people. (wear)",
          userAnswer: "",
          correctAnswer: "worn",
          marks: 0,
        },
        {
          question:
            "The doctor who treated you yesterday is my <input type='text'> .(guard)",
          userAnswer: "",
          correctAnswer: "guardian",
          marks: 0,
        },
        {
          question:
            "We have completed second term <input type='text'> (success)",
          userAnswer: "",
          correctAnswer: "successfully",
          marks: 0,
        },
        {
          question:
            "We should not be afraid of snakes because most of them are not <input type='text'> (poison)",
          userAnswer: "",
          correctAnswer: "poisonous",
          marks: 0,
        },
        {
          question:
            "A mango is more <input type='text'> than an apple. (juice)",
          userAnswer: "",
          correctAnswer: "juicy",
          marks: 0,
        },
        {
          question:
            "The bride was <input type='text'> dressed in her bridal gown when she went to church (smart)",
          userAnswer: "",
          correctAnswer: "smartly",
          marks: 0,
        },
        {
          question:
            "Godwin is the <input type='text'> boy in the class. (happy)",
          userAnswer: "",
          correctAnswer: "happiest",
          marks: 0,
        },
        {
          question:
            "The nurse will <input type='text'> all children who are below five years of age. (immunity)",
          userAnswer: "",
          correctAnswer: "immunise",
          marks: 0,
        },
        {
          question:
            "Which book gives the correct <input type='text'> of each word? (pronounce)",
          userAnswer: "",
          correctAnswer: "pronounciation",
          marks: 0,
        },
        {
          question:
            "The new words were <input type='text'> spelt by her. (correct)",
          userAnswer: "",
          correctAnswer: "correctly",
          marks: 0,
        },
      ],
    },
    {
      instruction:
        "In each of the questions 16 to 17, drag and drop the given words in alphabetical order.",
      category: "alphabetical",
      questions: [
        {
          question: "Arrange words: blunt, blink, blast, block",
          userAnswer: "",
          correctAnswer: "blast, blink, block, blunt",
          marks: 0,
        },
        {
          question: "Arrange words: dislike, district, discover, disobey",
          userAnswer: "",
          correctAnswer: "disobey, district, discover, dislike",
          marks: 0,
        },
      ],
    },
    {
      instruction:
        "In each of the questions 18 to 20, give one word for the underlined group of words.",
      category: "underlined",
      questions: [
        {
          question: "The teacher <u>does not like </u> children who steal. ",
          userAnswer: "",
          correctAnswer: "dislikes",
          marks: 0,
        },
        {
          question: "Beside fish, Mathew enjoy <u> sheep’s meat.</u> ",
          userAnswer: "",
          correctAnswer: "mutton",
          marks: 0,
        },
        {
          question:
            "The second scene of the play amused the <u> people watching it. </u>",
          userAnswer: "",
          correctAnswer: "spectators",
          marks: 0,
        },
      ],
    },
    {
      instruction:
        "In each of the questions 21 to 22, choose the sentence where the given word is used correctly.",
      category: "multiple_choice",
      questions: [
        {
          question: "break",
          userAnswer: "",
          correctAnswer: "Don't break the window.",
          marks: 0,
        },
        {
          question: "reed",
          userAnswer: "",
          correctAnswer: "The wind rustled the reeds by the lake.",
          marks: 0,
        },
      ],
    },
    {
      instruction:
        "In each of the questions 23 to 24, write the full form of the given abbreviation.",
      category: "abbreviation",
      questions: [
        {
          question: "Rev",
          userAnswer: "",
          correctAnswer: "Reverend",
          marks: 0,
        },
        {
          question: "shan't",
          userAnswer: "",
          correctAnswer: "shall not",
          marks: 0,
        },
      ],
    },
    {
      instruction:
        "In each of the questions 25 to 26, drag and drop the given words to from a sentence.",
      category: "sentence",
      questions: [
        {
          question: "Arrange words: quiet., is, baby, The, very",
          userAnswer: "",
          correctAnswer: "The, baby, is, very, quiet.",
          marks: 0,
        },
        {
          question: "Arrange words: tired., I, am, quite",
          userAnswer: "",
          correctAnswer: "I, am, quite, tired.",
          marks: 0,
        },
      ],
    },
    {
      instruction:
        "In each of the questions 27 to 28, give the opposite of the underlined word(s) or given word.",
      category: "opposite",
      questions: [
        {
          question: "Banks allow cash <u>deposits</u> anytime of the day.",
          userAnswer: "",
          correctAnswer: "withdraws",
          marks: 0,
        },
        {
          question: "Lydia has gone to the bank to <u>withdraw</u> some money.",
          userAnswer: "",
          correctAnswer: "deposit",
          marks: 0,
        },
      ],
    },
    {
      instruction:
        "In each of the questions 29 to 30, give the plural of the underlined or given word(s).",
      category: "plural",
      questions: [
        {
          question: "He bought the <u>ox</u> at a very high price.",
          userAnswer: "",
          correctAnswer: "oxen",
          marks: 0,
        },
        {
          question: "brother-in-law",
          userAnswer: "",
          correctAnswer: "brothers-in-law",
          marks: 0,
        },
      ],
    },
    {
      instruction:
        "In each of the questions 31 to 50, select the sentence with the correct rewritten option according to the instruction provided in the brackets.",
      category: "rewriteMultiplechoice",
      questions: [
        {
          question:
            "She drew some water from the well, didn't she?(Re- write the sentence ending……did she?)",
          userAnswer: "",
          correctAnswer: "She didn't draw any water from the well, did she?",
          marks: 0,
        },
        {
          question:
            "All the candidates who were in that school passed the examinations. (Re-write the sentence beginning: None…………………)",
          userAnswer: "",
          correctAnswer:
            "None of the candidates who were in that school failed the examinations.",
          marks: 0,
        },
        {
          question:
            "The proposer say that water is better than fire. (Rewrite the sentence ending: ……………” the proposers say.)",
          userAnswer: "",
          correctAnswer: "“Water is better than fire.” the proposers say.",
          marks: 0,
        },
        {
          question:
            "All baskets will be woven by the pupils today. (Re- write the sentence beginning:  Will……………?)",
          userAnswer: "",
          correctAnswer: "Will all baskets be woven by the pupil's today?",
          marks: 0,
        },
        {
          question:
            "He reached the railway station before noon. (Re- write the sentence using…arrived….)",
          userAnswer: "",
          correctAnswer: "He arrived at the railway station before noon.",
          marks: 0,
        },
        {
          question:
            "Who has broken my cup? (Rewrite the sentence using: By whom....)",
          userAnswer: "",
          correctAnswer: "By whom has my cup been broken?",
          marks: 0,
        },
        {
          question:
            "We shall have fantastic carols in the afternoon. (Rewrite the sentence using: ……going to ……)",
          userAnswer: "",
          correctAnswer:
            "We are going to have fantastic carols in the afternoon",
          marks: 0,
        },
        {
          question:
            "The leather bag is mine. It is maroon. It is small. (Rewrite as one sentence without using: “who”, “which”, “that”, “and”)",
          userAnswer: "",
          correctAnswer: "The small leather maroon bag is mine.",
          marks: 0,
        },
        {
          question:
            "Asiimwe is the hunter. I told you about him. (Re- write  as one  sentence using …………whom…………)",
          userAnswer: "",
          correctAnswer: "Assimwe is the hunter whom I told you.",
          marks: 0,
        },
        {
          question:
            "Magu does not know how to weave a basket. Rose does not know how to weave a basket. (Rewrite as one sentence using:….and neither…..)",
          userAnswer: "",
          correctAnswer:
            "Magu does not know how to weave a basket and neither does Rose.",
          marks: 0,
        },
        {
          question:
            "My little sister is very ill. She can’t eat any food. (Rewrite as one sentence using: ………so……that………)",
          userAnswer: "",
          correctAnswer:
            "My little sister is so ill that she can’t eat any food.",
          marks: 0,
        },
        {
          question:
            "We usually eat a balanced diet so that we can grow up well. (Rewrite the sentence using:….. in order to…..)",
          userAnswer: "",
          correctAnswer:
            "We usually eat a balanced diet in order to grow up well.",
          marks: 0,
        },
        {
          question:
            "Despite the fact that Alice was sick during the examination, she got a first grade.(Rewrite sentence using…………but……………)",
          userAnswer: "",
          correctAnswer:
            "Alice was sick during the examination but she got a first grade.",
          marks: 0,
        },
        {
          question:
            "The primary seven class cleaned the examination room. (Rewrite the sentence ending: …..class.)",
          userAnswer: "",
          correctAnswer:
            "The examination room was cleaned by the primary seven class.",
          marks: 0,
        },
        {
          question:
            "Fighting fellow pupils is bad. (Rewrite the sentence beginning: To….)",
          userAnswer: "",
          correctAnswer: "To fight fellow pupils is bad.",
          marks: 0,
        },
        {
          question:
            "Jeremiah is a disciplined boy so is Jesse. (Re- write the sentence beginning Both…)",
          userAnswer: "",
          correctAnswer: "Both Jesse and Jeremiah are disciplined boys.",
          marks: 0,
        },
        {
          question:
            "The patient is strong. He can bathe himself. (Rewrite as one sentence using: ....enough....)",
          userAnswer: "",
          correctAnswer: "The patient is strong enough to bathe himself.",
          marks: 0,
        },
        {
          question:
            "Teachers should guide children against immoral dancing. This act embarrasses the nation. (Rewrite as one sentence using:…..avoid….)",
          userAnswer: "",
          correctAnswer:
            "Teachers should guide children to avoid immoral dancing because it embarrasses the nation.",
          marks: 0,
        },
        {
          question:
            "The police didn't have handcuffs. The police didn't arrest the thief. (Rewrite as one sentence beginning: If………………)",
          userAnswer: "",
          correctAnswer:
            "If  the police had had handcuffs, they would have arrested the thief.",
          marks: 0,
        },
        {
          question:
            "The boy came late. The boy missed the lesson. (Re-write as one sentence using……because………)",
          userAnswer: "",
          correctAnswer: "The boy missed the lesson beause he came late.",
          marks: 0,
        },
      ],
    },
    {
      type: "iframeResults",
      data: [
        [
          {
            story:
              '\n   <div class="instruction">\n    Read the passage below and then answer the questions that follow in full sentences.\n   </div>\n   <div class="story">\n    <p>\n     Last term, Malindo Primary School held an election. Ms. Dorothy Awor, the chairperson of the school electoral commission,\n            organized the elections. She pinned the lists of\n     <u>\n      posts\n     </u>\n     on the notice board. She asked the pupils to apply for the posts.\n            Many pupils applied including the well-known boy, Bouncer Bino also known as BB. He was known in the school because of his pride.\n            He applied for the post of Head boy. As soon as BB handed in his application, he changed his style of walking.\n    </p>\n    <p>\n     Friday was the day for general campaigns. The chairperson called candidates to address the pupils. When BB was called upon,\n            pupils cheered him “Our boy BB! Our boy BB! ” However, he was disturbed by something he had no money to please his supporters.\n    </p>\n    <p>\n     When he returned home that evening, he asked his dad for some money for the campaigns. BB was very excited when his dad gave \n            him some money. he bought sweets, pan-cakes, buns and gave them quietly to every pupil he believed was his supporter. \n            On the day of the elections, the head teacher, Mr. Matovu was there to monitor the process. He wanted to ensure that there was \n            no\n     <u>\n      rigging\n     </u>\n     Indeed, there was free and fair elections.\n    </p>\n    <p>\n     When Ms. Dorothy Awor announced the results, a very humble boy who did not spend money was elected head boy. Bouncer Bino, \n            had lost. He was very disappointed and so were his parents. BB accepted the results and advised his supporters to work together \n            with the newly elected prefects. Mr. Matovu appreciated BB’s action and thanked him for the good spirit of togetherness\n    </p>\n   </div>\n   <div class="questions-container">\n    <ol id="questions-list" type="a">\n    <li><span class="question-number"></span> What was held in Malindo Primary School?<div><label><input type="radio" name="question-0" value="Sports were  held at Malinndo Primary School">Sports were  held at Malinndo Primary School</label><label><input type="radio" name="question-0" value="An election was held in Malindo Primary School.">An election was held in Malindo Primary School.</label><label><input type="radio" name="question-0" value="National exxaminations were  held at Malinndo Primary School.">National exxaminations were  held at Malinndo Primary School.</label></div><span class="cross">✗</span><span class="correct-answer">Correct answer: An election was held in Malindo Primary School.</span></li><li><span class="question-number"></span> Who was the chairperson of the electoral commission?<div><label><input type="radio" name="question-1" value="Mr. Matovu was the chairperson of the electoral commission.">Mr. Matovu was the chairperson of the electoral commission.</label><label><input type="radio" name="question-1" value="Bouncer Bino was the chairperson of the electoral commission.">Bouncer Bino was the chairperson of the electoral commission.</label><label><input type="radio" name="question-1" value="Ms. Dorothy Awor was the chairperson of the electoral commission.">Ms. Dorothy Awor was the chairperson of the electoral commission.</label></div><span class="cross">✗</span><span class="correct-answer">Correct answer: Ms. Dorothy Awor was the chairperson of the electoral commission.</span></li><li><span class="question-number"></span> Where was the list of the posts pinned?<div><label><input type="radio" name="question-2" value="The posts was pinned on the school bus.">The posts was pinned on the school bus.</label><label><input type="radio" name="question-2" value="The list of the posts was pinned on the notice board.">The list of the posts was pinned on the notice board.</label><label><input type="radio" name="question-2" value="The posts was pinned on the school calender.">The posts was pinned on the school calender.</label></div><span class="cross">✗</span><span class="correct-answer">Correct answer: The list of the posts was pinned on the notice board.</span></li><li><span class="question-number"></span>  Why was Bouncer Bino well-known in the school?<div><label><input type="radio" name="question-3" value="He was well-known in the school because his dad gave him some money.">He was well-known in the school because his dad gave him some money.</label><label><input type="radio" name="question-3" value="Bouncer Bino was well-known in the school because of he was going to be elected.">Bouncer Bino was well-known in the school because of he was going to be elected.</label><label><input type="radio" name="question-3" value="Bouncer Bino was well-known in the school because of his pride.">Bouncer Bino was well-known in the school because of his pride.</label></div><span class="cross">✗</span><span class="correct-answer">Correct answer: Bouncer Bino was well-known in the school because of his pride.</span></li><li><span class="question-number"></span> When did the pupils have general campaigns?<div><label><input type="radio" name="question-4" value="They had general campaigns on Monday.">They had general campaigns on Monday.</label><label><input type="radio" name="question-4" value="They had general campaigns on Thursday.">They had general campaigns on Thursday.</label><label><input type="radio" name="question-4" value="The pupils had general campaigns on Friday.">The pupils had general campaigns on Friday.</label></div><span class="cross">✗</span><span class="correct-answer">Correct answer: The pupils had general campaigns on Friday.</span></li><li><span class="question-number"></span> Why do you think BB’s dad gave him money?<div><label><input type="radio" name="question-5" value="BB\'s dad gave him money to please his supporters.">BB\'s dad gave him money to please his supporters.</label><label><input type="radio" name="question-5" value="BB\'s dad gave him money to win the election.">BB\'s dad gave him money to win the election.</label><label><input type="radio" name="question-5" value="BB\'s dad gave him money to print posters.">BB\'s dad gave him money to print posters.</label></div><span class="cross">✗</span><span class="correct-answer">Correct answer: BB\'s dad gave him money to please his supporters.</span></li><li><span class="question-number"></span> Why was the head teacher monitoring the process of the elections?<div><label><input type="radio" name="question-6" value="To ensure there was no rigging and to ensure the elections were free and fair.">To ensure there was no rigging and to ensure the elections were free and fair.</label><label><input type="radio" name="question-6" value="To count the votes.">To count the votes.</label><label><input type="radio" name="question-6" value="To ensure that Bouncer Bino won.">To ensure that Bouncer Bino won.</label></div><span class="cross">✗</span><span class="correct-answer">Correct answer: To ensure there was no rigging and to ensure the elections were free and fair.</span></li><li><span class="question-number"></span> What made the head teacher to appreciate Bouncer Bino’s action?<div><label><input type="radio" name="question-7" value="The head teacher appreciated Bouncer Bino\'s action because he gave sweets, pan-cakes and buns to every pupil">The head teacher appreciated Bouncer Bino\'s action because he gave sweets, pan-cakes and buns to every pupil</label><label><input type="radio" name="question-7" value="The head teacher appreciated Bouncer Bino\'s action because he accepted the election results.">The head teacher appreciated Bouncer Bino\'s action because he accepted the election results.</label><label><input type="radio" name="question-7" value="The head teacher appreciated Bouncer Bino\'s action because he changed his style of walking.">The head teacher appreciated Bouncer Bino\'s action because he changed his style of walking.</label></div><span class="cross">✗</span><span class="correct-answer">Correct answer: The head teacher appreciated Bouncer Bino\'s action because he accepted the election results.</span></li><li class="main">Give another word or a group of words with the same meaning as each of the underlined words in the passage.<ul><li class="subs">posts<input type="text" placeholder="Type your answer here"><span class="cross">✗</span><span class="correct-answer">Correct answers: positions</span></li><li class="subs">rigging<input type="text" placeholder="Type your answer here"><span class="cross">✗</span><span class="correct-answer">Correct answers: cheating</span></li></ul></li></ol>\n   </div>\n  ',
            totalMarks: 0,
          },
        ],
        [
          {
            story:
              '\n   <div class="instruction">\n    Read the invitation below careful and answer, in full sentence the question that follow.\n   </div>\n   <div class="invitation">\n    <div class="center">\n     <p>\n      ELECTION TIME HAS COME\n     </p>\n     <p>\n      ALL ADULTS ARE INFORMED\n     </p>\n     <p>\n      ARE YOU ABOVE IS YEARS OLD?\n     </p>\n     <p>\n      ARE YOU A CITIZEN OF UGANDA?\n     </p>\n     <p>\n      THIS IS FOR YOU!\n     </p>\n     <p>\n      ELECTION DAYS ARE 28\n      <sup>\n       TH\n      </sup>\n      AND 29\n      <sup>\n       TH\n      </sup>\n      NOVEMBER, 2001.\n     </p>\n     <p>\n      COME AND ELECT A PRESIDENT.\n     </p>\n     <p>\n      COME AND ELECT MEMBERS OF PARLIAMENT\n     </p>\n     <p>\n      GET YOUR VOTER’S CARD\n     </p>\n     <p>\n      BEFORE SUNDAY 27\n      <sup>\n       TH\n      </sup>\n      NOVEMBER.\n     </p>\n     <p>\n      <strong>\n       CHAIRMAN\n      </strong>\n     </p>\n     <p>\n      <strong>\n       ELECTORAL COMMISSION.\n      </strong>\n     </p>\n    </div>\n   </div>\n   <div class="questions-container">\n    <ol id="questions-list" type="a">\n    <li><span class="question-number"></span> Who wrote this notice?<div><label><input type="radio" name="question-0" value="The notice was written by the citizens of Uganda.">The notice was written by the citizens of Uganda.</label><label><input type="radio" name="question-0" value="The notice was written by members of parliament.">The notice was written by members of parliament.</label><label><input type="radio" name="question-0" value="The notice was written by the Chairman of the Electoral Commission.">The notice was written by the Chairman of the Electoral Commission.</label></div><span class="cross">✗</span><span class="correct-answer">Correct answer: The notice was written by the Chairman of the Electoral Commission.</span></li><li><span class="question-number"></span> What is the notice about?<div><label><input type="radio" name="question-1" value="The notice is about the president of Uganda.">The notice is about the president of Uganda.</label><label><input type="radio" name="question-1" value="The notice is about upcoming elections in Uganda.">The notice is about upcoming elections in Uganda.</label><label><input type="radio" name="question-1" value="The notice is about members of parliament in Uganda.">The notice is about members of parliament in Uganda.</label></div><span class="cross">✗</span><span class="correct-answer">Correct answer: The notice is about upcoming elections in Uganda.</span></li><li><span class="question-number"></span> Why do you think a 15 year old will not vote?<div><label><input type="radio" name="question-2" value="A fifteeen year old will not vote because voting is only eligible for people above eighteen yaers of age.">A fifteeen year old will not vote because voting is only eligible for people above eighteen yaers of age.</label><label><input type="radio" name="question-2" value="A fifteeen year old will not vote because voting is only eligible for people below eighteen yaers of age.">A fifteeen year old will not vote because voting is only eligible for people below eighteen yaers of age.</label></div><span class="cross">✗</span><span class="correct-answer">Correct answer: A fifteeen year old will not vote because voting is only eligible for people above eighteen yaers of age.</span></li><li><span class="question-number"></span> Why do you think Mrs. Njoroge from Kenya will not vote?<div><label><input type="radio" name="question-3" value="Mrs. Njoroge from kenya will not vote because she is below eighteen yaers of age.">Mrs. Njoroge from kenya will not vote because she is below eighteen yaers of age.</label><label><input type="radio" name="question-3" value="Mrs. Njoroge from kenya will vote because she is not Ugandan.">Mrs. Njoroge from kenya will vote because she is not Ugandan.</label><label><input type="radio" name="question-3" value="Mrs. Njoroge from kenya will not vote because she is not Ugandan.">Mrs. Njoroge from kenya will not vote because she is not Ugandan.</label></div><span class="cross">✗</span><span class="correct-answer">Correct answer: Mrs. Njoroge from kenya will not vote because she is not Ugandan.</span></li><li><span class="question-number"></span> When does voting end?<div><label><input type="radio" name="question-4" value="Voting ends on the 29th November, 2001.">Voting ends on the 29th November, 2001.</label><label><input type="radio" name="question-4" value="Voting ends on the 28th November, 2001.">Voting ends on the 28th November, 2001.</label><label><input type="radio" name="question-4" value="Voting ends on the 27th November, 2001.">Voting ends on the 27th November, 2001.</label></div><span class="cross">✗</span><span class="correct-answer">Correct answer: Voting ends on the 29th November, 2001.</span></li><li><span class="question-number"></span> Who is an adult?<div><label><input type="radio" name="question-5" value="An adult is a person who is 18 years and below.">An adult is a person who is 18 years and below.</label><label><input type="radio" name="question-5" value="An adult is a person who is 18 years and above.">An adult is a person who is 18 years and above.</label></div><span class="cross">✗</span><span class="correct-answer">Correct answer: An adult is a person who is 18 years and above.</span></li><li><span class="question-number"></span> In which country are the elections taking place?<input type="text" placeholder="Type your answer here"><span class="cross">✗</span><span class="correct-answer">Correct answers: Uganda</span></li><li><span class="question-number"></span> What is the last date for collecting voters’ cards?<div><label><input type="radio" name="question-7" value="The last date for collecting voters’ cards is 29th November, 2001.">The last date for collecting voters’ cards is 29th November, 2001.</label><label><input type="radio" name="question-7" value="The last date for collecting voters’ cards is 28th November, 2001.">The last date for collecting voters’ cards is 28th November, 2001.</label><label><input type="radio" name="question-7" value="The last date for collecting voters’ cards is 27th November, 2001.">The last date for collecting voters’ cards is 27th November, 2001.</label></div><span class="cross">✗</span><span class="correct-answer">Correct answer: The last date for collecting voters’ cards is 27th November, 2001.</span></li><li><span class="question-number"></span> Which organization in responsible for conducting these elections?<div><label><input type="radio" name="question-8" value="The organization responsible for conducting these elections is the Electoral Commission.">The organization responsible for conducting these elections is the Electoral Commission.</label><label><input type="radio" name="question-8" value="The organization responsible for conducting these elections is the Parliament of Uganda.">The organization responsible for conducting these elections is the Parliament of Uganda.</label></div><span class="cross">✗</span><span class="correct-answer">Correct answer: The organization responsible for conducting these elections is the Electoral Commission.</span></li></ol>\n   </div>\n  ',
            totalMarks: 0,
          },
        ],
        [
          {
            story:
              '\n   <div class="instruction">\n    A health parade was conducted in Pambaya Model School during the week. This was to help learners improve on their\n        personal hygiene. The prefects helped in the checking. Study the table below carefully and then answer in full \n        sentences the questions that follow.\n   </div>\n   <div class="story">\n    <table class="table">\n     <tbody><tr class="bold">\n      <td>\n       Days\n      </td>\n      <td>\n       Areas\n       <br>\n       Checked\n      </td>\n      <td>\n       Class\n      </td>\n      <td>\n       No.\n       <br>\n       of\n       <br>\n       Boys\n      </td>\n      <td>\n       No.\n       <br>\n       of\n       <br>\n       Girls\n      </td>\n      <td>\n       Name of Prefect\n      </td>\n      <td>\n       Name of\n       <br>\n       Supervisor\n       <br>\n       (Teacher)\n      </td>\n     </tr>\n     <tr>\n      <td class="bold" rowspan="3">\n       MONDAY\n      </td>\n      <td rowspan="3">\n       Uncombed\n       <br>\n       hair\n      </td>\n      <td>\n       P.1\n      </td>\n      <td>\n       7\n      </td>\n      <td>\n       4\n      </td>\n      <td>\n       Atwine Sabiti\n      </td>\n      <td rowspan="3">\n       Mr. Masaba\n       <br>\n       Isaac\n      </td>\n     </tr>\n     <tr>\n      <td>\n       P.2\n      </td>\n      <td>\n       2\n      </td>\n      <td>\n       2\n      </td>\n      <td>\n       Nabirye Maureen\n      </td>\n     </tr>\n     <tr>\n      <td>\n       P.3\n      </td>\n      <td>\n       5\n      </td>\n      <td>\n       3\n      </td>\n      <td>\n       Wano Rehema\n      </td>\n     </tr>\n     <tr>\n      <td class="bold" rowspan="3">\n       TUESDAY\n      </td>\n      <td rowspan="3">\n       Unbrushed\n       <br>\n       teeth\n      </td>\n      <td>\n       P.1\n      </td>\n      <td>\n       6\n      </td>\n      <td>\n       3\n      </td>\n      <td>\n       Akasime Michelle\n      </td>\n      <td rowspan="3">\n       Mr. Kitimbo\n       <br>\n       Ian\n      </td>\n     </tr>\n     <tr>\n      <td>\n       P.2\n      </td>\n      <td>\n       1\n      </td>\n      <td>\n       1\n      </td>\n      <td>\n       Mukasa Luke\n      </td>\n     </tr>\n     <tr>\n      <td>\n       P.3\n      </td>\n      <td>\n       0\n      </td>\n      <td>\n       0\n      </td>\n      <td>\n       Mugisha Ivan\n      </td>\n     </tr>\n     <tr>\n      <td class="bold" rowspan="3">\n       WEDNESDAY\n      </td>\n      <td rowspan="3">\n       Dirty body\n      </td>\n      <td>\n       P.1\n      </td>\n      <td>\n       8\n      </td>\n      <td>\n       4\n      </td>\n      <td>\n       Nabirye Maureen\n      </td>\n      <td rowspan="3">\n       Mrs. Aisu\n       <br>\n       Rehema\n      </td>\n     </tr>\n     <tr>\n      <td>\n       P.2\n      </td>\n      <td>\n       2\n      </td>\n      <td>\n       0\n      </td>\n      <td>\n       Wano Rehema\n      </td>\n     </tr>\n     <tr>\n      <td>\n       P.3\n      </td>\n      <td>\n       6\n      </td>\n      <td>\n       4\n      </td>\n      <td>\n       Akasime Michelle\n      </td>\n     </tr>\n     <tr>\n      <td class="bold" rowspan="3">\n       FRIDAY\n      </td>\n      <td rowspan="3">\n       Dirty\n       <br>\n       uniforms\n      </td>\n      <td>\n       P.1\n      </td>\n      <td>\n       16\n      </td>\n      <td>\n       10\n      </td>\n      <td>\n       Mugisha Ivan\n      </td>\n      <td rowspan="3">\n       Mr. Masaba\n       <br>\n       Isaac\n      </td>\n     </tr>\n     <tr>\n      <td>\n       P.2\n      </td>\n      <td>\n       5\n      </td>\n      <td>\n       3\n      </td>\n      <td>\n       Okello Eria\n      </td>\n     </tr>\n     <tr>\n      <td>\n       P.3\n      </td>\n      <td>\n       4\n      </td>\n      <td>\n       1\n      </td>\n      <td>\n       Nabirye Maureen\n      </td>\n     </tr>\n    </tbody></table>\n    <p class="key">\n     By Mrs Haumba Rehema\n     <br>\n     (Sanitation teacher)\n    </p>\n   </div>\n   <div class="questions-container">\n    <ol id="questions-list" type="a">\n    <li><span class="question-number"></span> Which school carried out the above activity?<input type="text" placeholder="Type your answer here"><span class="cross">✗</span><span class="correct-answer">Correct answers: Pambaya Model School</span></li><li><span class="question-number"></span> What did Atwine Sabiti do on Monday?<div><label><input type="radio" name="question-1" value="Atwine Sabiti checked P.2 pupils on Monday.">Atwine Sabiti checked P.2 pupils on Monday.</label><label><input type="radio" name="question-1" value="Atwine Sabiti checked P.1 pupils on Monday.">Atwine Sabiti checked P.1 pupils on Monday.</label><label><input type="radio" name="question-1" value="Atwine Sabiti checked P.3 pupils on Monday.">Atwine Sabiti checked P.3 pupils on Monday.</label></div><span class="cross">✗</span><span class="correct-answer">Correct answer: Atwine Sabiti checked P.1 pupils on Monday.</span></li><li><span class="question-number"></span> How many boys had dirty bodies in P.1 on Wednesday<div><label><input type="radio" name="question-2" value="Eight boys had dirty bodies in P.1 on Wednesday.">Eight boys had dirty bodies in P.1 on Wednesday.</label><label><input type="radio" name="question-2" value="Four boys had dirty bodies in P.1 on Wednesday.">Four boys had dirty bodies in P.1 on Wednesday.</label><label><input type="radio" name="question-2" value="Twelve boys had dirty bodies in P.1 on Wednesday.">Twelve boys had dirty bodies in P.1 on Wednesday.</label></div><span class="cross">✗</span><span class="correct-answer">Correct answer: Eight boys had dirty bodies in P.1 on Wednesday.</span></li><li><span class="question-number"></span> What happened to boys and girls in P.3 class on Tuesday?<div><label><input type="radio" name="question-3" value="All the boys and girls had unbrushed teeth in P.3 class on Tuesday.">All the boys and girls had unbrushed teeth in P.3 class on Tuesday.</label><label><input type="radio" name="question-3" value="All the boys and girls had brushed teeth in P.3 class on Tuesday.">All the boys and girls had brushed teeth in P.3 class on Tuesday.</label><label><input type="radio" name="question-3" value="All the boys and girls had dirty uniforms in P.3 class on Tuesday.">All the boys and girls had dirty uniforms in P.3 class on Tuesday.</label></div><span class="cross">✗</span><span class="correct-answer">Correct answer: All the boys and girls had brushed teeth in P.3 class on Tuesday.</span></li><li><span class="question-number"></span> What was the total number of girls who had dirty uniforms?<div><label><input type="radio" name="question-4" value="Eight girls had dirty uniforms.">Eight girls had dirty uniforms.</label><label><input type="radio" name="question-4" value="Four girls had dirty uniforms.">Four girls had dirty uniforms.</label><label><input type="radio" name="question-4" value="Fourteen girls had dirty uniforms.">Fourteen girls had dirty uniforms.</label></div><span class="cross">✗</span><span class="correct-answer">Correct answer: Fourteen girls had dirty uniforms.</span></li><li><span class="question-number"></span> Which prefect checked on the personal hygiene three times?<div><label><input type="radio" name="question-5" value="Nabirye Maureen checked on the personal hygiene three times.">Nabirye Maureen checked on the personal hygiene three times.</label><label><input type="radio" name="question-5" value="Akasime Michelle checked on the personal hygiene three times.">Akasime Michelle checked on the personal hygiene three times.</label><label><input type="radio" name="question-5" value="Wano Rehema checked on the personal hygiene three times.">Wano Rehema checked on the personal hygiene three times.</label></div><span class="cross">✗</span><span class="correct-answer">Correct answer: Nabirye Maureen checked on the personal hygiene three times.</span></li><li><span class="question-number"></span> How many teachers supervised the exercise?<div><label><input type="radio" name="question-6" value="Three teachers supervised the exercise.">Three teachers supervised the exercise.</label><label><input type="radio" name="question-6" value="Four teachers supervised the exercise.">Four teachers supervised the exercise.</label></div><span class="cross">✗</span><span class="correct-answer">Correct answer: Three teachers supervised the exercise.</span></li><li><span class="question-number"></span> On which day of the week was the checking not done?<div><label><input type="radio" name="question-7" value="The checking was not done on Saturday.">The checking was not done on Saturday.</label><label><input type="radio" name="question-7" value="The checking was not done on Thursday.">The checking was not done on Thursday.</label><label><input type="radio" name="question-7" value="The checking was not done on Sunday.">The checking was not done on Sunday.</label></div><span class="cross">✗</span><span class="correct-answer">Correct answer: The checking was not done on Thursday.</span></li><li><span class="question-number"></span> Who was in charge of sanitation in the school?<div><label><input type="radio" name="question-8" value="Mrs Haumba Rehema was in charge of sanitation in the school.">Mrs Haumba Rehema was in charge of sanitation in the school.</label><label><input type="radio" name="question-8" value="Mr Masaba Isaac was in charge of sanitation in the school.">Mr Masaba Isaac was in charge of sanitation in the school.</label><label><input type="radio" name="question-8" value="The prefects were in charge of sanitation in the school.">The prefects were in charge of sanitation in the school.</label></div><span class="cross">✗</span><span class="correct-answer">Correct answer: Mrs Haumba Rehema was in charge of sanitation in the school.</span></li><li><span class="question-number"></span> Why do you think all schools should carry out health parades?<div><label><input type="radio" name="question-9" value="All schools should carry out health parades because it promotes personal hygiene.">All schools should carry out health parades because it promotes personal hygiene.</label><label><input type="radio" name="question-9" value="All schools should carry out health parades to shame those who are unhygienic.">All schools should carry out health parades to shame those who are unhygienic.</label></div><span class="cross">✗</span><span class="correct-answer">Correct answer: All schools should carry out health parades because it promotes personal hygiene.</span></li></ol>\n   </div>\n  ',
            totalMarks: 0,
          },
        ],
        [
          {
            story:
              '\n   <div class="instruction">\n    The sentences below are not in the correct order. Drag and drop them\n      to form a short composition about “A health officer”\n   </div>\n   <div class="container">\n    <div class="drag-container" id="drag-container">\n    <div draggable="true" class="draggable-sentence" data-index="0">1. After his talk, one of the pupils asked him how HIV/AIDS could be avoided.</div><div draggable="true" class="draggable-sentence" data-index="1">2. He also advised pupils to avoid getting HIV/AIDS.</div><div draggable="true" class="draggable-sentence" data-index="2">3. He requested the headteacher to allow him talk to the pupils about HIV/AIDS.</div><div draggable="true" class="draggable-sentence" data-index="3">4. She welcomed the health officer’s request and organized for an assembly.</div><div draggable="true" class="draggable-sentence" data-index="4">5. The headteacher welcomed him and gave him the visitor’s book to sign.</div><div draggable="true" class="draggable-sentence" data-index="5">6. And he went straight to the headteacher’s office.</div><div draggable="true" class="draggable-sentence" data-index="6">7. The health officer explained to the pupils about the causes signs and symptoms of HIV/AIDS.</div><div draggable="true" class="draggable-sentence" data-index="7">8. One day, a health officer came to our school.</div><div draggable="true" class="draggable-sentence" data-index="8">9. Finally, the headboy thanked the health officer for the message on behalf of the pupils.</div><div draggable="true" class="draggable-sentence" data-index="9">10. Abstaining from sex and not sharing sharp objects was the answer he gave.</div></div>\n    <div class="drop-container" id="drop-container">\n    <div class="drop-placeholder">Drop the sentences here............</div></div>\n   </div>\n   <div class="result-container" id="result-container">Correct order: <div class="sentenceInOrder">1. One day, a health officer came to our school.</div><div class="sentenceInOrder">2. And he went straight to the headteacher’s office.</div><div class="sentenceInOrder">3. The headteacher welcomed him and gave him the visitor’s book to sign.</div><div class="sentenceInOrder">4. He requested the headteacher to allow him talk to the pupils about HIV/AIDS.</div><div class="sentenceInOrder">5. She welcomed the health officer’s request and organized for an assembly.</div><div class="sentenceInOrder">6. The health officer explained to the pupils about the causes signs and symptoms of HIV/AIDS.</div><div class="sentenceInOrder">7. He also advised pupils to avoid getting HIV/AIDS.</div><div class="sentenceInOrder">8. After his talk, one of the pupils asked him how HIV/AIDS could be avoided.</div><div class="sentenceInOrder">9. Abstaining from sex and not sharing sharp objects was the answer he gave.</div><div class="sentenceInOrder">10. This juncture marks the closure of one chapter and the commencement of another.</div></div>\n  ',
            totalMarks: 0,
          },
        ],
        [
          {
            story:
              '\n   <div class="instruction">\n    Drag and drop the sentences below in correct order to form a letter to the Head teacher of Rock High Secondary Schol, \n      P. O. Box 222, TORORO, applying for a vacancy in senior one.\n   </div>\n   <div class="container">\n    <div class="drag-container" id="drag-container">\n    <div draggable="true" class="draggable-sentence" data-index="0">I hope you will consider my application.</div><div draggable="true" class="draggable-sentence" data-index="1">The head teacher,</div><div draggable="true" class="draggable-sentence" data-index="2">I Wish to apply for a vacancy in you school in senior one next term.</div><div draggable="true" class="draggable-sentence" data-index="3">Yours faithfully</div><div draggable="true" class="draggable-sentence" data-index="4">John Doe</div><div draggable="true" class="draggable-sentence" data-index="5">RE: APPLICATION FOR A VACANCY IN SENIOR ONE.</div><div draggable="true" class="draggable-sentence" data-index="6">22/1/2024</div><div draggable="true" class="draggable-sentence" data-index="7">P.N primary school</div><div draggable="true" class="draggable-sentence" data-index="8">In my former primary school, I was a Prefect in charge of sports.</div><div draggable="true" class="draggable-sentence" data-index="9">Wakiso, Uganda</div><div draggable="true" class="draggable-sentence" data-index="10">Rock High Secondary School,</div><div draggable="true" class="draggable-sentence" data-index="11">Dear Sir/Madam</div><div draggable="true" class="draggable-sentence" data-index="12">P O Box 222,Tororo</div><div draggable="true" class="draggable-sentence" data-index="13">I am a boy aged fourteen years. I passed Primary Leaving Examination in Division one.</div><div draggable="true" class="draggable-sentence" data-index="14">P.O BOX 123</div></div>\n    <div class="drop-container" id="drop-container">\n    <div class="drop-placeholder">Drop the sentences here............</div></div>\n   </div>\n   <div class="result-container" id="result-container">Correct order: <div class="sentenceInOrder right-aligned">P.N primary school</div><div class="sentenceInOrder right-aligned">P.O BOX 123</div><div class="sentenceInOrder right-aligned">Wakiso, Uganda</div><div class="sentenceInOrder right-aligned">22/1/2024</div><div class="sentenceInOrder">The head teacher,</div><div class="sentenceInOrder">Rock High Secondary School,</div><div class="sentenceInOrder">P O Box 222,Tororo</div><div class="sentenceInOrder">Dear Sir/Madam</div><div class="sentenceInOrder">RE: APPLICATION FOR A VACANCY IN SENIOR ONE.</div><div class="sentenceInOrder">I Wish to apply for a vacancy in you school in senior one next term.</div><div class="sentenceInOrder">I am a boy aged fourteen years. I passed Primary Leaving Examination in Division one.</div><div class="sentenceInOrder">In my former primary school, I was a Prefect in charge of sports.</div><div class="sentenceInOrder">I hope you will consider my application.</div><div class="sentenceInOrder">Yours faithfully</div><div class="sentenceInOrder">John Doe</div></div>\n  ',
            totalMarks: 0,
          },
        ],
      ],
    },
  ];

  return (
    <div>
      {/* <h1>Quiz Results</h1> */}
      {results.length > 0 ? (
        <QuizResults results={results2} />
      ) : (
        <p>Loading results...</p>
      )}

      {/* <IframeComponent url="http://localhost:5173/" /> */}

      {/* <ExamPage></ExamPage> */}
    </div>
  );
}

export default Testing;
