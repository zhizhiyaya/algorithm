{
    "uuid":"uuid",
    "eventKey":"dwd事件键名",
    "eventName":"dwd事件名称",
    "relevance":"and",
    "list":[
        {
            "id":"ods信息唯一标识",
            "eventKey":"埋点键名1",
            "sql":"select * from ...",
            "eventType":"0"
        },
        {
            "list":[
                {
                    "id":"ods信息唯一标识",
                    "eventKey":"埋点键名1",
                    "sql":"select * from ...",
                    "eventType":"0"
                },
                {
                    "id":"ods信息唯一标识",
                    "eventKey":"埋点键名2",
                    "sql":"select * from ...",
                    "eventType":"1"
                }
            ],
           "relevance":"OR",
        }
    ]
}