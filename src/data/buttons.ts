import Button from '../components/Button.svelte';
import type { GridObject } from '../types/types';

export const buttons: GridObject[] = [
    {
        component: Button,
        name: 'redBtn',
        props: {
            text: 'Red'
        },
        validate: [
            {
                type: 'gte',
                value: 0
            }
        ],
        action: [
            {
                type: 'add',
                resource: 'red',
                amount: 1
            },
        ]
    },
    {
        component: Button,
        name: 'RE-1',
        props: {
            text: 'Red + 1'
        },
        validate: [
            {
                type: 'gte',
                resource: 'red',
                value: 10
            }
        ],
        requirements: [
            {
                color: '#af0000',
                resources: 'Red',
                value: 10
            }
        ],
        action: [
            {
                type: 'updateLevel',
                resource: 'red'
            },
            {
                type: 'consume',
                resource: 'red',
                amount: 10
            }
        ]
    },
    {
        component: Button,
        name: 'autoGen',
        props: {
            text: '자동 생성 +0.1'
        },
        validate: [
            {
                type: 'gte',
                resource: 'red',
                value: 5
            }
        ],
        requirements: [
            {
                color: '#af0000',
                resources: 'Red',
                value: 5
            }
        ],
        action: {
            type: 'increaseAutoGenerate',
            resource: 'red',
            amount: 0.1
        }
    },
    {
        component: Button,
        name: 'clickMult',
        props: {
            text: '클릭 배수 +0.5'
        },
        validate: [
            {
                type: 'gte',
                resource: 'red',
                value: 20
            }
        ],
        requirements: [
            {
                color: '#af0000',
                resources: 'Red',
                value: 20
            }
        ],
        action: {
            type: 'increaseClickMultiplier',
            resource: 'red',
            amount: 0.5
        }
    },
    {
        component: Button,
        name: 'consume',
        props: {
            text: '클릭 배수 소비 5'
        },
        validate: [
            {
                type: 'gte',
                resource: 'red',
                value: 5
            }
        ],
        requirements: [
            {
                color: '#af0000',
                resources: 'Red',
                value: 5
            }
        ],
        action: {
            type: 'consume',
            resource: 'red',
            amount: 5
        }
    }
]; 