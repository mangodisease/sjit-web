import { Row, Col, Card, Button } from "antd";

export default function Teachers(){

    return <>
    <Row gutter={[24, 5]}>
        <Col xs={24}>
        
        </Col>
        <Col xs={24}>
            <Card
            bordered
            title={
                <Row gutter={[24, 5]}>\
                <Col xs={24} lg={17}>
                    <b>List of Teachers</b>
                </Col>
                <Col xs={24} lg={6} >
                <Button
                size="small"
                onClick={()=>{
                    alert("test add ")
                }}
                style={{ float: "right"}}
                >
                    Add Teacher
                </Button>
                </Col>
                </Row>
            }
            >

            </Card>
        </Col>
    </Row>
    </>
}