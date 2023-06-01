/* eslint-disable */
import { Row, Col, Card, Button, Table, Modal, Form, Input, DatePicker, notification, Upload, Image, Select } from "antd";
import { getAllTeachers, AddStudent, UpdateStudent, AddTeacher, UpdateTeacher } from "../api";
import { useEffect, useState } from "react";
import logo from "../assets/images/favicon.png"
import { ToTopOutlined } from "@ant-design/icons";
import moment from "moment-timezone";
moment.tz.setDefault("Asia/Manila");

export default function Teachers() {

    const columns = [
        {
            title: "Teacher",
            render: val => (
                <Row>
                    <Col xs={24} lg={7}>
                        <Image src={`${val.image}`} width={60} height={60} style={{ borderRadius: 50 }} preview />
                    </Col>
                    <Col xs={24} lg={17}>
                        <span><b>Name: </b> {val.name}</span> <br />
                        <span><b>Birthdate:</b> {moment(val.birthdate).format("MM-DD-YYYY")}</span><br />
                        <span><b>Designation:</b> {val.designation}</span>
                    </Col>
                </Row>
            )
        },
        {
            title: "Contact",
            render: val => (
                <span>
                    <b>Contact #: </b> {val.contact} <br />
                    <b>Address: </b> <i>{val.address}</i>
                </span>
            )
        },
        {
            title: <center>Action</center>,
            render: val => (
                <center>
                    <Row>
                        <Col lg={12} xs={24} style={{ marginBottom: 10 }}>
                            <Button
                                type={"primary"}
                                onClick={() => {
                                    setshowadd(true)
                                    val.birthdate = moment(val.birthdate)
                                    setselTeach(val)
                                    form.setFieldsValue(val)
                                }}
                            >
                                EDIT
                            </Button>
                        </Col>
                        <Col lg={12} xs={24}>
                            <Button
                                type={"danger"}
                                onClick={() => {

                                }}
                            >
                                DELETE
                            </Button>
                        </Col>

                    </Row>
                </center>
            )
        },
    ]

    const [list, setlist] = useState(null)
    const [showadd, setshowadd] = useState(false)
    const [selTeach, setselTeach] = useState(null)

    async function setTeachers() {
        await getAllTeachers()
            .then(res => {
                const data = res.data
                setlist(data.result)
            }).catch(err => {
                console.log(err.message)
                setlist(null)
            })
    }

    useEffect(async () => {
        await setTeachers()
    },
        // eslint-disable-next-line
        [])

    const [form] = Form.useForm()
    const init = {
        "name": "",
        "birthdate": "",
        "address": "",
        "designation": "",
        "contact": "",
        "username": "",
        "password": "123456789"
        
    }
    // eslint-disable-next-line
    const [selectedFile, setselectedFile] = useState(null)
    const [selectedFileList, setselectedFileList] = useState([])
    const [imageUrl, setimageUrl] = useState("")

    const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const onChange = e => {
        if (e.file.type.includes("image")) {
            switch (e.file.status) {
                case "uploading":
                    setselectedFileList([e.file]);
                    setimageUrl("");
                    console.log("uploading")
                    console.log(e.file)
                    break;
                case "done":
                    console.log(e.file)
                    setselectedFile(e.file.originFileObj);
                    setselectedFileList([e.file]);
                    getBase64(e.file.originFileObj, (url) => {
                        setimageUrl(url);
                    });

                    break;

                default:
                    setimageUrl("");
                    setselectedFile(null);
                    setselectedFileList([]);
            }
        } else {
            notification.info({
                message: "Select an image file only!"
            })
        }

    };

    function clear() {
        setshowadd(false)
        setselTeach(null)
        form.resetFields()
        setimageUrl('')
        setselectedFileList([])
    }
    const [saving, setsaving] = useState(false)

    async function Add(file, values) {
        try {
            if (file !== null && imageUrl !== "") {
                values.image = imageUrl
                console.log(values)
                await AddTeacher(values)
                .then(res=>{
                    console.log(res.data)
                    if(res.data.inserted){
                        alert("Added Successfully")
                    } else {
                        alert("Unable to add teacher, Please try again later!")
                    }
                    setsaving(false)
                    clear()
                    setTeachers()
                })
            } else {
                notification.info({
                    message: "Please insert/select a image!"
                })
                setsaving(false)
            }
        } catch (err) {
            console.log(err.message)
            setsaving(false)
        }
    }

    async function Update(file, values, selTeach) {
        if(file!==null && imageUrl!==""){
            values.image = imageUrl
        }
        await UpdateTeacher(values, { _id: selTeach._id })
        .then(res=>{
            if(res.data.updated){
                alert("Successfully Updated!")
                setTeachers()
                clear()
            } else {
                alert("Unable to update, Please try again later!")
            }
            setsaving(false)
        }).catch(err=>{
            alert(err.message)
            setsaving(false)
        })

        
    }

    async function Submit(what, values) {
        try {
            setsaving(true)
            console.log(values)
            if (what === "Update") {
                Update(selectedFile, values, selTeach)
            } else {
                Add(selectedFile, values)
            }
        } catch (err) {
            console.log(err.message)
            console.log(" here")
        }
    }

    return <>
        <Modal
            title="Add Teacher"
            onCancel={() => {
                setshowadd(false)
                clear()
            }}
            open={showadd}
            footer={[
                <center>
                    <Button
                        type={"danger"}
                        onClick={() => {
                            setshowadd(false)
                            clear()
                        }}
                    >
                        CANCEL
                    </Button>
                    <Button
                        type={"primary"}
                        loading={saving}
                        onClick={() => {
                            form.submit()
                        }}
                    >
                        {
                            selTeach === null ? saving? "SUBMITTING" : "SUBMIT" : saving? "UPDATING" : "UPDATE"
                        }
                    </Button>
                </center>
            ]}
        >
            <Form
                form={form}
                initialValues={init}
                onFinish={async (values) => {
                    console.log(values)
                    if (selTeach === null) {
                        if (imageUrl === "" && selectedFile === null) {
                            notification.warning({
                                message: "Please select/insert a product image to upload!",
                                placement: "topRight"
                            })
                        } else {
                            values.image = imageUrl
                            await Submit("Add", values)
                        }
                    }
                    //update
                    else {
                        if (imageUrl === "" && selectedFile === null) {
                            //dont update image
                            await Submit("Update", values, false)
                        } else {
                            //update image
                            await Submit("Update", values, true)
                        }
                    }


                }}
                onFinishFailed={err => {
                    console.log(err)
                    notification.warn({
                        message: "Please fill in the from completely!"
                    })
                }}
                alignment="horizontal"
            >
                <Row gutter={[24, 5]}>
                    <Col xs={24}>
                        <center>
                            <Upload
                                fileList={selectedFileList}
                                customRequest={dummyRequest}
                                onChange={e => {
                                    console.log(e)
                                    onChange(e)
                                }}
                            >

                                <Col xs={24} >
                                    <Image
                                        style={{ pointer: "cursor", borderRadius: 100 }}
                                        width={200}
                                        height={200}
                                        src={selTeach === null ? imageUrl : imageUrl!==""? imageUrl : selTeach.image}
                                        fallback={logo}
                                        preview={false}
                                    />
                                </Col>

                                <center>
                                    <Button type="link" style={{ color: "black" }} >
                                        <ToTopOutlined style={{ fontSize: 20, color: "green" }} /> {"SELECT AN IMAGE"}
                                    </Button>
                                </center>
                            </Upload>

                        </center>
                    </Col>
                    <Col xs={24}>
                        <Form.Item
                            name="name"
                            label="Fullname"
                            rules={[
                                { required: true, message: "Please input your fullname!" },
                            ]}
                        >
                            <Input type="text" placeholder="e.g. John Doe" />
                        </Form.Item>
                    </Col>
                  
                    <Col xs={24}>
                        <Form.Item
                            name="birthdate"
                            label="Birthdate"
                            rules={[
                                { required: true, message: "Please fill in this field!" },
                            ]}
                        >
                            <DatePicker style={{ width: "100%" }} format={"MM-DD-YYYY"} placeholder="MM-DD-YYYY" />
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item
                            name="designation"
                            label="Designation"
                            rules={[
                                { required: true, message: "Please fill in this field!" },
                            ]}
                        >
                            <Input type="text" placeholder="" />
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item
                            name="contact"
                            label="Contact"
                            rules={[
                                { required: true, message: "Please input contact #!" },
                            ]}
                        >
                            <Input type="text" placeholder="e.g.09123456789" />
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item
                            name="address"
                            label="Address"
                            rules={[
                                { required: true, message: "Please fill in this field!" },
                            ]}
                        >
                            <Input.TextArea type="text" placeholder="" />
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item
                            name="username"
                            label="Username"
                            rules={[
                                { required: true, message: "Please enter username!" },
                            ]}
                        >
                            <Input type="text" placeholder="username" />
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[
                                { required: true, message: "Please enter password!" },
                            ]}
                        >
                            <Input.Password size="small" placeholder="password" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
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
                                    onClick={() => {
                                        setshowadd(true)
                                    }}
                                    style={{ float: "right" }}
                                >
                                    Add Teacher
                                </Button>
                            </Col>
                        </Row>
                    }
                >
                    <Table
                        className="ant-list-box table-responsive"
                        columns={columns}
                        loading={list===null}
                        dataSource={list}
                    />
                </Card>
            </Col>
        </Row>
    </>
}