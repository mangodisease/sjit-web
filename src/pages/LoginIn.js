/* eslint-disable */
import { Row, Col, Button, Checkbox, Form, Input, Card, Modal } from "antd"
import logo from "../assets/images/favicon.png"
import { useState } from "react";
import { loginAPI } from "../api";
import { useHistory } from "react-router-dom";

export default function Login(props) {
    const history = useHistory()

    const { loginAs, setloginAs, open, setopen, setuser } = props

    const onFinish = async (values) => {
        console.log('Success:', values);
        delete values.remember
        console.log(values)
        let col = "user"
        if(loginAs!==""){
            if(loginAs==="Admin"){
                col = "user"
            } else {
                col = `${loginAs.toLowerCase()}s`
            }
        } 
        console.log(col)
        await loginAPI(col, values.username, values.password)
        .then(res=>{
            const data = res.data
            console.log(data)
            alert(data.msg)
            if(data.login){
                setuser(data.user)
                localStorage.setItem("user", JSON.stringify(data.user))
                //change depending on loginAs

                history.push("/class-schedule")
            }
        }).catch(err=>{
            console.log(err.message)
            alert("Invalid username or password! Please try again later.")
        })
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    }

    return <>
        <Modal
            centered
            width={"auto"}
            title={<center><b>Login as 🤔? </b></center>}
            closable={false}
            onCancel={() => {

            }}
            open={open}
            footer={null}
        >
            <Row gutter={[24, 5]}>
                <Col xs={24} lg={8}>
                    <Card hoverable style={{ borderColor: "gray", height: 100 }}
                        onClick={() => {
                            setloginAs("Admin")
                            setopen(false)
                        }}
                    >
                        <center style={{ marginTop: 17 }}>
                            <b>🔒 ADMIN</b>
                        </center>
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card hoverable style={{ borderColor: "gray", height: 100 }}
                        onClick={() => {
                            setloginAs("Teacher")
                            setopen(false)
                        }}
                    >
                        <center style={{ marginTop: 17 }}>
                            <b>👩‍🏫 TEACHER</b>
                        </center>
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card hoverable style={{ borderColor: "gray", height: 100 }}
                        onClick={() => {
                            setloginAs("Student")
                            setopen(false)
                        }}
                    >
                        <center style={{ marginTop: 17 }}>
                            <b>👨‍🎓 STUDENT</b>
                        </center>
                    </Card>
                </Col>
            </Row>
        </Modal>
        <Row gutter={[24, 5]} style={{ width: window.innerWidth, padding: 5 }}>
            <Col xs={24} style={{ marginTop: window.innerHeight * .25 }}>
                <Card>
                    <center>
                        <h1> <img src={logo} width={100} /> Attendance - Sign In</h1>
                        <Form
                            layout="horizontal"
                            labelCol={{
                                span: 8,
                            }}
                            wrapperCol={{
                                span: 16,
                            }}
                            style={{
                                maxWidth: 600,
                            }}
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="Username"
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your username!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item
                                wrapperCol={{
                                    offset: 8,
                                    span: 16,
                                }}
                            >
                                <Button type="primary" htmlType="submit">
                                    {`Login as ${loginAs}`}
                                </Button>
                            </Form.Item>

                            <Form.Item
                                name="remember"
                                wrapperCol={{
                                    offset: 8,
                                    span: 16,
                                }}
                            >
                                <Button type="link"
                                onClick={()=>{
                                    setopen(true)
                                    setloginAs("")
                                }}
                                >
                                    Change Login?
                                </Button>
                            </Form.Item>


                        </Form>
                    </center>
                </Card>
            </Col>
        </Row>
    </>
}