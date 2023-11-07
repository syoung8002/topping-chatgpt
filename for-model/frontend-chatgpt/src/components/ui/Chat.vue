<template>
    <div style="max-height:80vh;">
        <li v-for="(message, index) in messages" :key="index">{{message.role}} : {{message.text}}
        
            <v-btn v-if="message.role == 'system'" @click="doit(message)">실행</v-btn>
        </li>
        <v-text-field v-model="newMessage"></v-text-field>
        <v-btn @click="sendMessage">send</v-btn>
    </div>
</template>

<script>
import ChatGenerator from "../ai/ChatGenerator.js"
import apiSpec from "../api/openapi.yaml"

export default {
    name: 'Chat',
    components:{
    },
    data: () => ({
        messages: [],
        newMessage: "",
        generator: null,
        input: {}
    }),

    created(){
        this.generator = new ChatGenerator(this, {isStream: true,preferredLanguage: "Korean"})
        this.generator.previousMessages = [{
            role: 'system',
            content: `
시스템과 사용자간 챗봇을 제공하려고 해.

CONSTRAINTS:

1. ~4000 word limit for short term memory. Your short term memory is short, so immediately save important information to files.
2. If you are unsure how you previously did something or want to recall past events, thinking about similar events will help you remember.
3. If you are unsure about any of arguments from user input, you have to create an error for user to know which argument should be input again.
4. Exclusively use the commands listed in double quotes e.g. "command name"

COMMANDS:

commands are described with OpenAPI3 as below:

${apiSpec}

ERRORS:

1. Incomplete Arguments: "INCOMPLETE-ARGS"

PERFORMANCE EVALUATION:

1. Continuously review and analyze your actions to ensure you are performing to the best of your abilities.
2. Constructively self-criticize your big-picture behavior constantly.
3. Reflect on past decisions and strategies to refine your approach.
4. Every command has a cost, so be smart and efficient. Aim to complete tasks in the least number of steps.

You should only respond in JSON format as described below (don't skip the thoughts and speak at least)

RESPONSE FORMAT:
[{
    "command": {
        "name": "command name",
        "args":{
            "key": "value"
        }
    },
    "thoughts": {
        "text": "thought",
        "reasoning": "reasoning",
        "plan": [short bulleted,list that conveys,long-term plan],
        "criticism": "constructive self-criticism",
        "speak": "thoughts summary to say to user"
    },
    "error": {
        "name": "error name",
        "speak": "error message to user"
    }
}]  
`

        }]
    },
    methods:{

        sendMessage(){
            this.messages.push(
                {
                    role: "user",
                    text: this.newMessage
                }
            );

            this.generator.generate()

            this.newMessage = ""


        },

        onGenerationFinished(responses){

            console.log(responses);

            responses.forEach(response=> {
                this.messages.push({
                    role:'system',
                    text: response.thoughts ? response.thoughts.speak :  response.command.name + "을 다음의 아규먼트로 실행합니다: " + JSON.stringify(response.command.args),
                    command: response.command
                })
            })

        },

        doit(message){
            alert(JSON.stringify(message.command))
        }

    }
}
</script>