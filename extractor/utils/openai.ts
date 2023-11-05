import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const function_descriptions = [
    {
        name: 'scan_resume',
        description: 'Scans a resume and returns relevant information',
        parameters: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'Name of the person',
                },
                email: {
                    type: 'string',
                    description: 'Email of the person',
                },
                phone: {
                    type: 'string',
                    description: 'Phone number of the person',
                },
                total_experience: {
                    type: 'string',
                    description: 'Total work experience of the person',
                },
                education: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            school: {
                                type: 'string',
                                description: 'Name of the school',
                            },
                            degree_or_certificate: {
                                type: 'string',
                                description: 'Degree or certificate',
                            },
                            time_period: {
                                type: 'string',
                                description: 'Time period of education',
                            },
                        },
                    },
                    description: 'Education of the person',
                },
                employment: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            company: {
                                type: 'string',
                                description: 'Name of the company',
                            },
                            title: {
                                type: 'string',
                                description: 'Title of the person',
                            },
                            time_period: {
                                type: 'string',
                                description: 'Time period of employment',
                            },
                        },
                    },
                    description: 'Employment history of the person',
                },
                skills: {
                    type: 'array',
                    items: {
                        type: 'string',
                        description: 'Skills of the person',
                    },
                },
                languages: {
                    type: 'array',
                    items: {
                        type: 'string',
                        description: 'Languages that a person can speak',
                    },
                },
            },
            required: ['name', 'email', 'phone', 'skills'],
        },
    },
];

export async function extractInfo(resumeText: string) {
    const systemPrompt =
        'Please analyze the provided resume and extract the candidates personal information, educational background, work experience, skills, and references. Sort work experience from current to old. If any information is not available, please indicate it as N/A.';

    const messages: ChatCompletionMessageParam[] = [
        {
            role: 'system',
            content: systemPrompt,
        },
        {
            role: 'user',
            content: `Resume : ${resumeText}`,
        },
    ];

    const chatCompletion = await openai.chat.completions.create({
        messages: messages,
        model: 'gpt-3.5-turbo-0613',
        functions: function_descriptions,
        temperature: 0,
    });

    return chatCompletion.choices[0]?.message?.function_call?.arguments;
}
