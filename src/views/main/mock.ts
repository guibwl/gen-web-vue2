

export const adminBpsMockVue2 = {
    schema: [
        {
            type: 'h1',
            id: 'header-01',
            children: 'Vue2 GenWeb'
        },
        {
            type: 'Divider',
            id: 'Divider-0',
            data: {
                props: {
                    orientation: "left"
                },
            },
            children: '这是一根分割线',
        },
        {
            type: 'Table',
            id: 'Table-00',
            data: {
                style: { minWidth: '100%' },
                props: {
                    dataSource: [
                        {
                          key: '1',
                          name: 'John Brown',
                          money: '￥300,000.00',
                          address: 'New York No. 1 Lake Park',
                        },
                        {
                          key: '2',
                          name: 'Jim Green',
                          money: '￥1,256,000.00',
                          address: 'London No. 1 Lake Park',
                        },
                        {
                          key: '3',
                          name: 'Joe Black',
                          money: '￥120,000.00',
                          address: 'Sidney No. 1 Lake Park',
                        },
                    ],
                    columns: [
                        {
                          title: 'Name',
                          dataIndex: 'name',
                          scopedSlots: { customRender: 'name' },
                        },
                        {
                          title: 'Cash Assets',
                          className: 'column-money',
                          dataIndex: 'money',
                        },
                        {
                          title: 'Address',
                          dataIndex: 'address',
                        },
                        {
                            title: '操作',
                            customRender: `(recode, row, i, ...args) => {
                                const [{h, node}] = args.slice(-1);
                                
                                return h('a', {on: {
                                    click: () => {
                                        console.log('>>>>>', recode, args)
                                        node.data.props.dataSource[i].address = '数据已经修改'
                                    }
                                }}, '执行')
                            }`
                        }
                    ]
                }
            }
        },
        {
            type: 'Select',
            id: 'Select-00',
            data: {
                props: {
                    allowClear: true,
                    showSearch: true,
                    placeholder: '请选择',
                },
                style: { minWidth: '400px', marginRight: '10px'}
            },
            children: [
                {
                    type: 'Select.Option',
                    id: 'Select.Option-00',
                    children: 'jack',
                    data: {
                        key: '1',
                        props: {
                            value: 'jack'
                        },
                    }
                },
                {
                    type: 'Select.Option',
                    id: 'Select.Option-01',
                    children: 'lucy',
                    data: {
                        key: '2',
                        props: {
                            value: 'lucy'
                        },
                    }
                }
            ]
        },
        {
            type: 'InputNumber',
            id: 'InputNumber-00',
            data: {
                props: {
                    min: 1,
                    max: 10,
                    defaultValue: 1,
                    style: { marginRight: '10px' },
                    formatter: `(value) => \`\${(+value).toFixed(2)}%\`;`,
                    parser: "(value) => value.replace('%', '')"
                },
                on: {
                    change: `(i, arg) => {
                        console.log('>>>', i, arg)
                    }`
                }
            },
        },
        {
            type: 'Popover',
            id: 'Popover-00',
            data: {
                props: {
                    title: 'Popover',
                },
            },
            children: [
                {
                    type: 'template',
                    id: 'Popover-div-00',
                    data: {
                        slot: 'content',
                    },
                    children: [
                        {
                            type: 'p',
                            id: 'Popover-p-00',
                            children: 'content - 1',
                            data: {
                                on: {
                                    click: `(i, arg) => {
                                        console.log('content - 1 >>>', i, arg)
                                    }`
                                },
                            }
                        },
                        {
                            type: 'p',
                            id: 'Popover-p-01',
                            children: 'content - 2',
                            data: {
                                on: {
                                    click: `(i, arg) => {
                                        console.log('content - 2 >>>', i, arg)
                                        const {node} = arg

                                        node.children.value = Date.now().toString()
                                    }`
                                },
                            }
                        }
                    ]
                },
                {
                    type: 'Button',
                    id: 'Popover-Button-00',
                    slot: 'default',
                    data: {
                        props: {
                            type: 'primary',
                        },
                        style: {
                            'margin-left': '20px'
                        },
                    },
                    children: 'Hover me'
                }
            ]
        }
    ]
}