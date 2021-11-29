import {Result, Button} from 'antd'
export default function NoAccess (props: any): JSX.Element {
    return (
        <Result
            status="403"
            title="403"
            subTitle='您暂时无法访问该资源'
            extra={<Button type="primary" onClick={() => {
                props.history.goBack(-1)
            }}>返回</Button>}
        />
    )
}
