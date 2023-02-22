import Webcam from "react-webcam";
import { useState } from "react";
// eslint-disable-next-line
import { Row, Col, notification, Button, Image, Alert } from "antd";
import { isMobile } from "react-device-detect";
import axios from "axios";

export default function Schedule(){

    const uri = "https://sjit-attendance-api.herokuapp.com/test-attendance"

    const videoConstraints = {
        width: isMobile? "auto" : 500,
        height: isMobile? "auto" : 500,
        facingMode: "user"
      };
      const [predicting, setpredicting] = useState(false)
      const [imgSrc, setimgSrc] = useState("")
      const [result, setresult] = useState(null)
      const dataURLtoFile = (dataurl, filename) => {
        var arr = dataurl.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);
    
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
      }
      // eslint-disable-next-line
      const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
          onSuccess("ok");
        }, 0);
      };
    // eslint-disable-next-line
      const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
      };
      const Attend = async (file) => {
        try {
    
          var formData = new FormData();
          formData.append("File", file);
          await axios.post(uri, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }).then(res => {
            console.log(res.data)
            setpredicting(false)
            setresult(res.data)
            setTimeout(()=>{
                setresult(null)
            }, 5000)
          }).catch(err => {
            console.log(err.message)
            setresult(null)
            setpredicting(false)
          })
        } catch (err) {
          console.log(err.message)
          setresult(null)
          setpredicting(false)
        }
      }
    return <>
    <Row gutter={[24, 5]}>
        <Col xs={24}>
            {
                result!==null&&
                <Alert message={
                    <center>
                        Successfully Attended! <br/>
                        {JSON.stringify(result)}
                    </center>
                }
                type="success"/>
            }
            <center>
                Sample Attendance Face Recognition<br/>
                {
                    predicting?
                    <Col xs={24}>
                        <Image
                    src={imgSrc}
                    preview={false}
                    width={isMobile? "auto" : 500}
                    height={isMobile? "auto" : 500}
                    />
                    <Button
                          style={{ marginTop: 20, width: "72%", }}
                            loading
                          className='btn btn-success'
                        >
                          Attending Schedule . . .
                        </Button>
                    </Col>
                    :
                    <Webcam
                      audio={false}
                      height={isMobile? "auto" : 500}
                      width={isMobile? "auto" : 500}
                      screenshotFormat="image/jpeg"
                      videoConstraints={videoConstraints}
                    >
                      {({ getScreenshot }) => (
                        <Button
                          style={{ marginTop: 20, width: "72%", }}

                          onClick={() => {
                            const imageSrc = getScreenshot();

                            setimgSrc(imageSrc)
                            setpredicting(true)
                            const file = dataURLtoFile(imageSrc, "file")
                            console.log(file)
                            Attend(file)

                          }}
                          className='btn btn-success'
                        >
                          Attend
                        </Button>

                      )}
                    </Webcam>
                }
                
            </center>

        </Col>
    </Row>
    </>
}