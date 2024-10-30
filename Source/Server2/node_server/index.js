const axios = require('axios');
const express = require('express');
// const url = "http://127.0.0.1:5000/";
const url = "https://iare-compete-python-scrapper.vercel.app/";
const morgan = require('morgan')
const turso = require('./db/config')
const cors = require('cors')
const app = express();


app.use(cors());
app.use(express.json())
app.use(morgan('dev'))

let lc_fakes = []

let fails = {
    lc : [],
    cc : [],
    gfg : [],
    hrc : []
}
const get_CodeChef = (username) => {
    console.log("CodeChef:",username);
    return axios.post(url + "test_url_cc", { username })
        .then((res) => res.data)
        .catch((err) => {
            console.error("Error fetching CodeChef data:",err.message);
            fails.cc.push(username)
            console.log(username,"Failed")
            return {}; 
        }); 
};

const get_LeetCode = (username) => {
    // console.log("LeetCode");
    return axios.post(url + "test_url_lc", { username })
        .then((res) => res.data)
        .catch((err) => {
            console.error("Error fetching LeetCode data:", err.message);
            lc_fakes.push(username);
            fails.lc.push(username)
            return {
                "name": 'null',
                "problemsSolved": {
                    "All": -1,
                    "Easy": -1,
                    "Hard": -1,
                    "Medium": -1
                },
                "username": username
                }; 
        });
};

const get_GeekForGeeks = (username) => {
    return axios.post(url + "test_url_gfg", { username:username })
        .then((res) => res.data)
        .catch((err) => {
            console.error("Error fetching GFG data:", err.message);
            fails.gfg.push(username)
            return {};  
        });
};

const get_HackerRank = (username) => {
    // console.log("HackerRank");
    return axios.post(url + "test_url_hrc", { username })
        .then((res) => res.data)
        .catch((err) => {
            console.error("Error fetching HackerRank data:", err.message);
            fails.hrc.push(username)
            return {};  
        });
};


app.get('/lc_fakes',(req,res)=>{
    console.log(lc_fakes,fails)
    res.status(200).json({lc_fakes,fails});
})
const scrap_function = (usernames,idx) => {
    // Check if LeetCode username is not empty
    if (usernames.leetcode) {
        const data_leet = get_LeetCode(usernames.leetcode);
        Promise.resolve(data_leet)
            .then((res) => {
                const name = res.name || '';
                const easy = res.problemsSolved.Easy || 0;
                const medium = res.problemsSolved.Medium || 0;
                const hard = res.problemsSolved.Hard || 0;
                const user = usernames.leetcode || '';
                turso.execute({
                    sql: `UPDATE LeetCode SET Name = :name, EasyProblemSolved = :easy, 
                            MediumProblemSolved = :medium, HardProblemSolved = :hard WHERE username = :user;`,
                    args: { name, easy, medium, hard, user }
                })
                .then((result) => {
                    console.log(idx," - LeetCode ",usernames.leetcode," Updated Successfully. Progress : 1/4 ");
                    // Check if CodeChef username is not empty
                })
                .catch((err) => {
                    console.error("LeetCode Update Failed:", err);
                });
            })
            .catch((err) => {
                console.error("Error fetching LeetCode data:", err);
            });
    }
    else{
        console.log(usernames.RollNumber+"No LeetCode account ?")
    }

    if (usernames.gfg) {
        const data_gfg = get_GeekForGeeks(usernames.gfg);
        Promise.resolve(data_gfg)
            .then((res12) => {
                const collegeName = res12.college || '';
                const rank = res12.Rank || null;
                const problemSolved = res12.problems_solved || 0;
                const contestRating = res12.contest_rating || 0;
                const score = res12.score || 0;
                const user = usernames.gfg || '';
                turso.execute({
                    sql: `UPDATE GeekForGeeks SET CollegeName = :collegeName, Rank_ = :rank, 
                        ProblemSolved = :problemSolved, ContestRating = :contestRating, 
                        Score = :score WHERE Username = :user;`,
                    args: { collegeName, rank, problemSolved, contestRating, score, user }
                })
                .then((res_12) => {
                    console.log(idx," - GeekForGeeks ",usernames.gfg," Updated Successfully. Progress: 3/4");
                    // Check if HackerRank username is not empty
                    
                })
                .catch((err12) => {
                    console.log(err12);
                });
            })
            .catch((err1) => {
                console.log(err1);
            });
    } else{
        console.log(usernames.RollNumber+"No GFG account ?")
    }

    if (usernames.hackerrank) {
        const data_hacker_rank = get_HackerRank(usernames.hackerrank);
        Promise.resolve(data_hacker_rank)
            .then((res123) => {
                console.log(res123);
                const name = res123.name || '';
                const oneStarBadge = res123.badges.oneStarBadge || 0;
                const twoStarBadge = res123.badges.twoStarBadge || 0;
                const threeStarBadge = res123.badges.threeStarBadge || 0;
                const fourStarBadge = res123.badges.fourStarBadge || 0;
                const fiveStarBadge = res123.badges.fiveStarBadge || 0;
                const advancedCert = res123.certificates.advanced || 0;
                const intermediateCert = res123.certificates.intermediate || 0;
                const basicCert = res123.certificates.basic || 0;
                const user = usernames.hackerrank || '';
                turso.execute({
                    sql: `UPDATE HackerRank SET Name = :name, oneStarBadge = :oneStarBadge, 
                        twoStarBadge = :twoStarBadge, threeStarBadge = :threeStarBadge, 
                        fourStarBadge = :fourStarBadge, fiveStarBadge = :fiveStarBadge, 
                        AdvancedCertifications = :advancedCert, IntermediateCertifications = :intermediateCert, 
                        BasicCertifications = :basicCert WHERE Username = :user;`,
                    args: { name, oneStarBadge, twoStarBadge, threeStarBadge, 
                            fourStarBadge, fiveStarBadge, advancedCert, 
                            intermediateCert, basicCert, user }
                })
                .then((res1234) => {
                    console.log(idx," - HackerRank ",usernames.hackerrank," Updated Successfully. Progress: 4/4");
                })
                .catch((Err1234) => {
                    console.log(Err1234);
                });
            })
            .catch((err123) => {
                console.log(err123);
            });
    }
    else{
        console.log(usernames.RollNumber+"No HackerRank account ?")
    }

     // if (usernames.codechef) {
    //     const data_codechef = get_CodeChef(usernames.codechef);
    //     Promise.resolve(data_codechef)
    //         .then((res1) => {
    //             const name = res1.name || '';
    //             const contests = res1.contests || 0;
    //             const problemSolved = res1['problems-Solved'] || 0;
    //             const user = usernames.codechef || '';
    //             turso.execute({
    //                 sql: `UPDATE CodeChef SET Name = :name, Contests = :contests, 
    //                     ProblemSolved = :problemSolved WHERE Username = :user;`,
    //                 args: { name, contests, problemSolved, user }
    //             })
    //             .then((res_1) => {
    //                 // if(usernames.codechef === 'varun9392'){
    //                 //     console.log(res_1.columns)
    //                 // }
    //                 console.log(idx," - CodeChef ",usernames.codechef," Updated Successfully. Progress: 2/4");
    //                 // Check if GeekForGeeks username is not empty
                    
    //             })
    //             .catch((err1) => {
    //                 console.log(err1);
    //             });
    //         })
    //         .catch((err1) => {
    //             console.log(err1);
    //         });
    // }
    // else{
    //     console.log(usernames.RollNumber+"No CodeChef account ?")
    // }

};



app.get("/", (req, res) => {
    const usernames = {
        leetcode: "varun_chowdary99",
        gfg: "saivarunchowdary",
        codechef: "varun9392",
        hackerrank: "saivarunchowdar2"
    };
    const leetcodePromise = get_LeetCode(usernames.leetcode);
    const codechefPromise = get_CodeChef(usernames.codechef);
    const hackerrankPromise = get_HackerRank(usernames.hackerrank);
    const gfgPromise = get_GeekForGeeks(usernames.gfg);

    Promise.all([leetcodePromise, codechefPromise, hackerrankPromise, gfgPromise])
        .then((results) => {
            const studentData = {
                name: "Polusasu Sai Varun",
                roll: "22951A05G8",
                ScoreData: {
                    leetcode: results[0],
                    codechef: results[1],
                    hackerrank: results[2],
                    geekforgeeks: results[3]
                }
            };
            res.status(200).json(studentData);
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            res.status(500).send("An error occurred while fetching data.");
        });

        axios.get(url)
        .then((resp0)=>{
            console.log("failed:",resp0.data);
            if(resp0.length > 10){
                update_failed_cc(resp0.data)
            }
        })
        .catch((err)=>{
            console.log(err);
        })
});

app.get("/update_all", (req, res) => {
    const startTime = Date.now(); 
    turso.execute(`
        SELECT 
            sd.RollNumber,
            sd.Name,
            lc.Username AS leetcode,
            cc.Username AS codechef,
            hr.Username AS hackerrank,
            gfg.Username AS gfg
        FROM 
            Student_Data sd
        LEFT JOIN 
            LeetCode lc ON sd.RollNumber = lc.RollNumber
        LEFT JOIN 
            CodeChef cc ON sd.RollNumber = cc.RollNumber
        LEFT JOIN 
            HackerRank hr ON sd.RollNumber = hr.RollNumber
        LEFT JOIN 
            GeekForGeeks gfg ON sd.RollNumber = gfg.RollNumber
        GROUP BY 
            sd.RollNumber, sd.Name, lc.Username, cc.Username, hr.Username, gfg.Username;
    `)
    .then((queryResult) => {
        const promises = queryResult.rows.map((ele, idx) => {
            return scrap_function(ele, idx + 1);  
        });
        return Promise.all(promises);
    })
    .then(() => {
        const endTime = Date.now(); 
        const timeTaken = (endTime - startTime) / 1000; 
        turso.execute("SELECT COUNT(*) as count FROM Student_Data ;")
        .then((resppp)=>{
            res.status(200).send(`Scraping and update completed in ${timeTaken} seconds. Records Updates : ${resppp.rows[0]['count']}`);
        })
    })
    .catch((err) => {
        console.error("Error executing SQL query:", err);
        res.status(500).send("Failed to execute query");
    });
    
});

app.post("/get-user-data",(req,res)=>{
    const {roll} = req.body;
    console.log(req.body)
    turso.execute(
        {
            sql:` 
    SELECT 
    sd.RollNumber AS RollUMN,
    sd.Name,
    sd.department,
    lc.Username AS lc_username,
    COALESCE(lc.EasyProblemSolved, 0) AS lc_easy,
    COALESCE(lc.MediumProblemSolved, 0) AS lc_medium,
    COALESCE(lc.HardProblemSolved, 0) AS lc_hard,
    cc.Contests AS cc_contests,
    COALESCE(cc.ProblemSolved, 0) AS cc_problemsolved,
    cc.Username AS cc_username,
    hr.Username AS hrc_username,
    COALESCE(hr.oneStarBadge, 0) AS hrc_oneStarBadge,
    COALESCE(hr.twoStarBadge, 0) AS hrc_twoStarBadge,
    COALESCE(hr.threeStarBadge, 0) AS hrc_threeStarBadge,
    COALESCE(hr.fourStarBadge, 0) AS hrc_fourStarBadge,
    COALESCE(hr.fiveStarBadge, 0) AS hrc_fiveStarBadge,
    COALESCE(hr.AdvancedCertifications, 0) AS hrc_AdvancedCertifications,
    COALESCE(hr.IntermediateCertifications, 0) AS hrc_IntermediateCertifications,
    COALESCE(hr.BasicCertifications, 0) AS hrc_BasicCertifications,
    gfg.Username AS gfg_username,
    COALESCE(gfg.Rank_, 0) AS gfg_rank,
    COALESCE(gfg.ProblemSolved, 0) AS gfg_problemSolved,
    COALESCE(gfg.ContestRating, 0) AS gfg_contestRating,
    COALESCE(gfg.Score, 0) AS gfg_score,
    ( (COALESCE(lc.EasyProblemSolved, 0) * 1) +
        (COALESCE(lc.MediumProblemSolved, 0) * 3) +
        (COALESCE(lc.HardProblemSolved, 0) * 5) ) AS LC_S,
    ((COALESCE(cc.Contests, 0) * 5) +
            (COALESCE(cc.ProblemSolved, 0))) AS CC_S,
    ( (COALESCE(gfg.Score, 0)) ) AS GFG_S,
    
    (
            (COALESCE(hr.oneStarBadge, 0) * 1) +
            (COALESCE(hr.twoStarBadge, 0) * 2) +
            (COALESCE(hr.threeStarBadge, 0) * 3) +
            (COALESCE(hr.fourStarBadge, 0) * 4) +
            (COALESCE(hr.fiveStarBadge, 0) * 5) +
            (COALESCE(hr.AdvancedCertifications, 0) * 7) +
            (COALESCE(hr.IntermediateCertifications, 0) * 5) +
            (COALESCE(hr.BasicCertifications, 0) * 3)
    ) AS HRC_S,
    (
       ( (COALESCE(lc.EasyProblemSolved, 0) * 1) +
        (COALESCE(lc.MediumProblemSolved, 0) * 3) +
        (COALESCE(lc.HardProblemSolved, 0) * 5) )+

        ((COALESCE(cc.Contests, 0) * 5) +
        (COALESCE(cc.ProblemSolved, 0)) )+
       ( (COALESCE(gfg.Score, 0))) +
       ( (COALESCE(hr.oneStarBadge, 0) * 1) +
        (COALESCE(hr.twoStarBadge, 0) * 2) +
        (COALESCE(hr.threeStarBadge, 0) * 3) +
        (COALESCE(hr.fourStarBadge, 0) * 4) +
        (COALESCE(hr.fiveStarBadge, 0) * 5) +
        (COALESCE(hr.AdvancedCertifications, 0) * 7) +
        (COALESCE(hr.IntermediateCertifications, 0) * 5) +
        (COALESCE(hr.BasicCertifications, 0) * 3))
    ) AS OverallScore,
    RANK() OVER (ORDER BY 
        (
            (COALESCE(lc.EasyProblemSolved, 0) * 1) +
            (COALESCE(lc.MediumProblemSolved, 0) * 3) +
            (COALESCE(lc.HardProblemSolved, 0) * 5) +
            (COALESCE(cc.Contests, 0) * 5) +
            (COALESCE(cc.ProblemSolved, 0)) +
            (COALESCE(gfg.Score, 0)) +
            (COALESCE(hr.oneStarBadge, 0) * 1) +
            (COALESCE(hr.twoStarBadge, 0) * 2) +
            (COALESCE(hr.threeStarBadge, 0) * 3) +
            (COALESCE(hr.fourStarBadge, 0) * 4) +
            (COALESCE(hr.fiveStarBadge, 0) * 5) +
            (COALESCE(hr.AdvancedCertifications, 0) * 7) +
            (COALESCE(hr.IntermediateCertifications, 0) * 5) +
            (COALESCE(hr.BasicCertifications, 0) * 3)
        ) DESC
    ) AS rank
        FROM 
            Student_Data sd
        LEFT JOIN 
            LeetCode lc ON sd.RollNumber = lc.RollNumber
        LEFT JOIN 
            CodeChef cc ON sd.RollNumber = cc.RollNumber
        LEFT JOIN 
            HackerRank hr ON sd.RollNumber = hr.RollNumber
        LEFT JOIN 
            GeekForGeeks gfg ON sd.RollNumber = gfg.RollNumber
        WHERE sd.RollNumber LIKE (:roll);
            `,
            args : {roll:roll}
        }
    )
    .then((resp)=>{
        if(resp.rows.length===1){
            res.status(200).json(resp.rows);
        }else{
            if(resp.rows.length>1){
                res.status(400).json({'message':'Multiple Users!'})
            }
            else{
                res.status(400).json({'message':' Users not found'})
            }
        }
    })
    .catch((err)=>{
        console.log(err);
        res.status(400).json({'message':' Please Try later!'})
    })
})

app.get('/get-all-data',(req,res)=>{
    turso.execute(
        `
           SELECT 
    sd.RollNumber AS RollUMN,
    sd.Name,
    sd.department,
    lc.Username AS lc_username,
    COALESCE(lc.EasyProblemSolved, 0) AS lc_easy,
    COALESCE(lc.MediumProblemSolved, 0) AS lc_medium,
    COALESCE(lc.HardProblemSolved, 0) AS lc_hard,
    cc.Contests AS cc_contests,
    COALESCE(cc.ProblemSolved, 0) AS cc_problemsolved,
    cc.Username AS cc_username,
    hr.Username AS hrc_username,
    COALESCE(hr.oneStarBadge, 0) AS hrc_oneStarBadge,
    COALESCE(hr.twoStarBadge, 0) AS hrc_twoStarBadge,
    COALESCE(hr.threeStarBadge, 0) AS hrc_threeStarBadge,
    COALESCE(hr.fourStarBadge, 0) AS hrc_fourStarBadge,
    COALESCE(hr.fiveStarBadge, 0) AS hrc_fiveStarBadge,
    COALESCE(hr.AdvancedCertifications, 0) AS hrc_AdvancedCertifications,
    COALESCE(hr.IntermediateCertifications, 0) AS hrc_IntermediateCertifications,
    COALESCE(hr.BasicCertifications, 0) AS hrc_BasicCertifications,
    gfg.Username AS gfg_username,
    COALESCE(gfg.Rank_, 0) AS gfg_rank,
    COALESCE(gfg.ProblemSolved, 0) AS gfg_problemSolved,
    COALESCE(gfg.ContestRating, 0) AS gfg_contestRating,
    COALESCE(gfg.Score, 0) AS gfg_score,
    ( (COALESCE(lc.EasyProblemSolved, 0) * 1) +
        (COALESCE(lc.MediumProblemSolved, 0) * 3) +
        (COALESCE(lc.HardProblemSolved, 0) * 5) ) AS LC_S,
    ((COALESCE(cc.Contests, 0) * 5) +
            (COALESCE(cc.ProblemSolved, 0))) AS CC_S,
    ( (COALESCE(gfg.Score, 0)) ) AS GFG_S,
    
    (
            (COALESCE(hr.oneStarBadge, 0) * 1) +
            (COALESCE(hr.twoStarBadge, 0) * 2) +
            (COALESCE(hr.threeStarBadge, 0) * 3) +
            (COALESCE(hr.fourStarBadge, 0) * 4) +
            (COALESCE(hr.fiveStarBadge, 0) * 5) +
            (COALESCE(hr.AdvancedCertifications, 0) * 7) +
            (COALESCE(hr.IntermediateCertifications, 0) * 5) +
            (COALESCE(hr.BasicCertifications, 0) * 3)
    ) AS HRC_S,
    (
       ( (COALESCE(lc.EasyProblemSolved, 0) * 1) +
        (COALESCE(lc.MediumProblemSolved, 0) * 3) +
        (COALESCE(lc.HardProblemSolved, 0) * 5) )+

        ((COALESCE(cc.Contests, 0) * 5) +
        (COALESCE(cc.ProblemSolved, 0)) )+
       ( (COALESCE(gfg.Score, 0))) +
       ( (COALESCE(hr.oneStarBadge, 0) * 1) +
        (COALESCE(hr.twoStarBadge, 0) * 2) +
        (COALESCE(hr.threeStarBadge, 0) * 3) +
        (COALESCE(hr.fourStarBadge, 0) * 4) +
        (COALESCE(hr.fiveStarBadge, 0) * 5) +
        (COALESCE(hr.AdvancedCertifications, 0) * 7) +
        (COALESCE(hr.IntermediateCertifications, 0) * 5) +
        (COALESCE(hr.BasicCertifications, 0) * 3))
    ) AS OverallScore,
    RANK() OVER (ORDER BY 
        (
            (COALESCE(lc.EasyProblemSolved, 0) * 1) +
            (COALESCE(lc.MediumProblemSolved, 0) * 3) +
            (COALESCE(lc.HardProblemSolved, 0) * 5) +
            (COALESCE(cc.Contests, 0) * 5) +
            (COALESCE(cc.ProblemSolved, 0)) +
            (COALESCE(gfg.Score, 0)) +
            (COALESCE(hr.oneStarBadge, 0) * 1) +
            (COALESCE(hr.twoStarBadge, 0) * 2) +
            (COALESCE(hr.threeStarBadge, 0) * 3) +
            (COALESCE(hr.fourStarBadge, 0) * 4) +
            (COALESCE(hr.fiveStarBadge, 0) * 5) +
            (COALESCE(hr.AdvancedCertifications, 0) * 7) +
            (COALESCE(hr.IntermediateCertifications, 0) * 5) +
            (COALESCE(hr.BasicCertifications, 0) * 3)
        ) DESC
    ) AS rank
        FROM 
            Student_Data sd
        LEFT JOIN 
            LeetCode lc ON sd.RollNumber = lc.RollNumber
        LEFT JOIN 
            CodeChef cc ON sd.RollNumber = cc.RollNumber
        LEFT JOIN 
            HackerRank hr ON sd.RollNumber = hr.RollNumber
        LEFT JOIN 
            GeekForGeeks gfg ON sd.RollNumber = gfg.RollNumber
        ORDER BY 
            OverallScore DESC;
        `
    )
    .then((eess)=>{
        // console.log(eess.rows)
        res.status(200).json(eess.rows);
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).json(err);
    })
})

app.get("/put_departments", (req, res) => {
    const data = [
        {
            departmentCode: "CSE",
            departmentName: "Computer Science and Engineering"
        },
        {
            departmentCode: "IT",
            departmentName: "Information Technology"
        },
        {
            departmentCode: "CSIT",
            departmentName: "Computer Science and Engineering & Information Technology"
        },
        {
            departmentCode: "CSD",
            departmentName: "Computer Science and Engineering Data Science"
        },
        {
            departmentCode: "CSM",
            departmentName: "Computer Science and Engineering (AI & ML)"
        },
        {
            departmentCode: "CSC",
            departmentName: "Computer Science and Engineering Cyber Security"
        },
        {
            departmentCode: "ECE",
            departmentName: "Electronics and Communication Engineering"
        },
        {
            departmentCode: "EEE",
            departmentName: "Electrical and Electronics Engineering"
        },
        {
            departmentCode: "AE",
            departmentName: "Aeronautical Engineering"
        },
        {
            departmentCode: "ME",
            departmentName: "Mechanical Engineering"
        },
        {
            departmentCode: "CE",
            departmentName: "Civil Engineering"
        }
    ];

    const queries = data.map(department => {
        return turso.execute(`INSERT INTO Departments (departmentCode, departmentName) VALUES (?, ?)`, 
                             [department.departmentCode, department.departmentName]);
    });

    Promise.all(queries)
        .then(results => {
            res.status(200).json({ message: "Departments inserted successfully", results });
        })
        .catch(error => {
            console.log(error);
            res.status(400).json({ error });
        });
});

app.get("/get-departments",(req,res)=>{
    turso.execute("SELECT * FROM Departments ;")
    .then((resp)=>{
        res.status(200).json(resp.rows);
    })
    .catch((err)=>{
        console.log(err);
        res.status(400).json(err);
    })
})

app.post('/addStudent',(req,res)=>{
    const { RollNumber,Name,Department,leetcode,CodeChef,HackerRank,GfG } = req.body;
    console.log(RollNumber);
    turso.execute({
        sql:`INSERT INTO Student_Data(RollNumber,Name,Department)
	            VALUES (:rollNo,:name,:dept) ;`,
                args:{rollNo:RollNumber,name:Name,dept:Department}
    })
        .then((respp)=>{
            console.log("student Added");
            turso.execute({
                sql:"INSERT INTO LeetCode(RollNumber,Username) VALUES(:roll,:leetcode);",
                args:{roll:RollNumber,leetcode:leetcode.length===0?null:leetcode}
            })
            .then((res0)=>{
                console.log("Leetcode Username added");
                turso.execute({
                    sql:"INSERT INTO GeekForGeeks(RollNumber,Username) VALUES(:roll,:GfG);",
                    args:{roll:RollNumber,GfG:GfG.length===0?null:GfG}
                })
                .then((res1)=>{
                    console.log("CodeChef Username added");
                    turso.execute({
                        sql:"INSERT INTO CodeChef(RollNumber,Username) VALUES(:roll,:CodeChef);",
                        args:{roll:RollNumber,CodeChef:CodeChef.length===0?null:CodeChef}
                    })
                    .then((res2)=>{
                        console.log("HackerRank Username added");
                        turso.execute({
                            sql:"INSERT INTO HackerRank(RollNumber,Username) VALUES(:roll,:HackerRank);",
                            args:{roll:RollNumber,HackerRank:HackerRank.length===0?null:HackerRank}
                        })
                        .then((res3)=>{
                            console.log("Leetcode Username added");
                            res.status(200).json(JSON.stringify(res3.rows));
                        })
                        .catch((er3)=>{
                            console.log(er3);
                            res.status(400).json(er3);
                        })                    })
                    .catch((er2)=>{
                        console.log(er2);
                        res.status(400).json(er2);
                    })                
                })
                .catch((er1)=>{
                    console.log(er1);
                    res.status(400).json(er0);
                })
            })
            .catch((er0)=>{
                console.log(er0);
                res.status(400).json(er0);
            })
        })
        .catch((er)=>{
            console.log(er);
            res.status(400).json(er);
        })
})

app.post('/update_user',(req,res)=>{
    const  RollNumber = req.body.RollNumber;
    console.log(RollNumber)
    turso.execute({
        sql:`
        SELECT 
            sd.RollNumber,
            sd.Name,
            lc.Username AS leetcode,
            cc.Username AS codechef,
            hr.Username AS hackerrank,
            gfg.Username AS gfg
        FROM 
            Student_Data sd
        LEFT JOIN 
            LeetCode lc ON sd.RollNumber = lc.RollNumber
        LEFT JOIN 
            CodeChef cc ON sd.RollNumber = cc.RollNumber
        LEFT JOIN 
            HackerRank hr ON sd.RollNumber = hr.RollNumber
        LEFT JOIN 
            GeekForGeeks gfg ON sd.RollNumber = gfg.RollNumber 
        WHERE sd.RollNumber = (:RollNumber) 
        GROUP BY 
            sd.RollNumber, sd.Name, lc.Username, cc.Username, hr.Username, gfg.Username ;
    `,
    args:{ RollNumber:RollNumber}
})
    .then((respp)=>{
        console.log(respp.rows);
        if(respp.rows.length > 0){

            let failed = '';
            let success = '';
            const lc = respp.rows[0].leetcode;
            const cc = respp.rows[0].codechef;
            const hr = respp.rows[0].hackerrank;
            const gfg = respp.rows[0].gfg;
            
            if (lc) {
                const data_leet = get_LeetCode(lc);
                Promise.resolve(data_leet)
                    .then((res) => {
                        const name = res.name || '';
                        const easy = res.problemsSolved.Easy || 0;
                        const medium = res.problemsSolved.Medium || 0;
                        const hard = res.problemsSolved.Hard || 0;
                        const user = lc || '';
                        turso.execute({
                            sql: `UPDATE LeetCode SET Name = :name, EasyProblemSolved = :easy, 
                                    MediumProblemSolved = :medium, HardProblemSolved = :hard WHERE username = :user;`,
                            args: { name, easy, medium, hard, user }
                        })
                        .then((result) => {
                            success = success.concat('LeetCode,')
                            console.log(" - LeetCode ",lc," Updated Successfully. Progress : 1/4 ");
                        })
                        .catch((err) => {
                            failed = failed.concat('LeetCode Failed ,');
                            console.error("LeetCode Update Failed:", err);
                        });
                    })
                    .catch((err) => {
                        console.error("Error fetching LeetCode data:", err);
                    });
            }
            else{
                failed = failed.concat('LeetCode No Account ,');
                console.log(RollNumber+"No LeetCode account ?")
            }
        
            if (gfg) {
                const data_gfg = get_GeekForGeeks(gfg);
                Promise.resolve(data_gfg)
                    .then((res12) => {
                        const collegeName = res12.college || '';
                        const rank = res12.Rank || null;
                        const problemSolved = res12.problems_solved || 0;
                        const contestRating = res12.contest_rating || 0;
                        const score = res12.score || 0;
                        const user = gfg || '';
                        turso.execute({
                            sql: `UPDATE GeekForGeeks SET CollegeName = :collegeName, Rank_ = :rank, 
                                ProblemSolved = :problemSolved, ContestRating = :contestRating, 
                                Score = :score WHERE Username = :user;`,
                            args: { collegeName, rank, problemSolved, contestRating, score, user }
                        })
                        .then((res_12) => {
                            console.log(" - GeekForGeeks ",gfg," Updated Successfully. Progress: 3/4");
                            success = success.concat('GeekForGeeks,')
                            
                        })
                        .catch((err12) => {
                            failed = failed.concat('GeekForGeeks failed,');
                            console.log(err12);
                        });
                    })
                    .catch((err1) => {
                        console.log(err1);
                    });
            } else{
                failed = failed.concat('GeekForGeeks No Account,');
                console.log(RollNumber+"No GFG account ?")
            }
        
            if (hr) {
                const data_hacker_rank = get_HackerRank(hr);
                Promise.resolve(data_hacker_rank)
                    .then((res123) => {
                        console.log(res123);
                        const name = res123.name || '';
                        const oneStarBadge = res123.badges.oneStarBadge || 0;
                        const twoStarBadge = res123.badges.twoStarBadge || 0;
                        const threeStarBadge = res123.badges.threeStarBadge || 0;
                        const fourStarBadge = res123.badges.fourStarBadge || 0;
                        const fiveStarBadge = res123.badges.fiveStarBadge || 0;
                        const advancedCert = res123.certificates.advanced || 0;
                        const intermediateCert = res123.certificates.intermediate || 0;
                        const basicCert = res123.certificates.basic || 0;
                        const user = hr || '';
                        turso.execute({
                            sql: `UPDATE HackerRank SET Name = :name, oneStarBadge = :oneStarBadge, 
                                twoStarBadge = :twoStarBadge, threeStarBadge = :threeStarBadge, 
                                fourStarBadge = :fourStarBadge, fiveStarBadge = :fiveStarBadge, 
                                AdvancedCertifications = :advancedCert, IntermediateCertifications = :intermediateCert, 
                                BasicCertifications = :basicCert WHERE Username = :user;`,
                            args: { name, oneStarBadge, twoStarBadge, threeStarBadge, 
                                    fourStarBadge, fiveStarBadge, advancedCert, 
                                    intermediateCert, basicCert, user }
                        })
                        .then((res1234) => {
                            success = success.concat('HackerRank ,');
                            console.log(" - HackerRank ",hr," Updated Successfully. Progress: 4/4");
                        })
                        .catch((Err1234) => {
                            failed = failed.concat('HackerRank ,');
                            console.log(Err1234);
                        });
                    })
                    .catch((err123) => {
                        console.log(err123);
                    });
            }
            else{
                failed = failed.concat('HackerRank No Account,');
                console.log(RollNumber+"No HackerRank account ?")
            }
        
            if (cc) {
                const data_codechef = get_CodeChef(cc);
                Promise.resolve(data_codechef)
                    .then((res1) => {
                        const name = res1.name || '';
                        const contests = res1.contests || 0;
                        const problemSolved = res1['problems-Solved'] || 0;
                        const user = cc || '';
                        turso.execute({
                            sql: `UPDATE CodeChef SET Name = :name, Contests = :contests, 
                                ProblemSolved = :problemSolved WHERE Username = :user;`,
                            args: { name, contests, problemSolved, user }
                        })
                        .then((res_1) => {
                            success = success.concat('CodeChef ,');
                            console.log(" - CodeChef ",cc," Updated Successfully. Progress: 2/4");                            
                        })
                        .catch((err1) => {
                            failed = failed.concat('CodeChef Failed,');
                            console.log(err1);
                        });
                    })
                    .catch((err1) => {
                        console.log(err1);
                    });
            }
            else{
                failed = failed.concat('CodeChef No Account,');
                console.log(RollNumber+"No CodeChef account ?")
            }

            res.status(200).json({'failed':failed,'success':success,'message':'Completed'});
        }
        else{
            res.status(400).json(respp.rows);
        }
    })
    .catch((erro)=>{
        console.log(erro.message);
        res.status(400).json({'message':'SomeThing went wrong'});
    })
})

app.post('/login',(req,res)=>{
    const {RollNumber,Password} = req.body;
    console.log(RollNumber,Password)
    turso.execute({
        sql:"SELECT * FROM Users WHERE RollNumber = (:RollNumber)",
        args:{ RollNumber: RollNumber }
    })
    .then((res0)=>{
        console.log(res0.rows)
        if(res0.rows.length === 1){
            if((res0.rows[0].Password === Password)){
                const currentDate = new Date();
                const expireTime = new Date(currentDate.getTime() + 1 * 60 * 60 * 1000);
                console.log(expireTime);
    
                console.log(RollNumber,"Logged IN");
                res.status(200).json({'message':"Correct",'expire_time':expireTime});
    
            }else{
                console.log(RollNumber,"LogIN - failed");
                res.status(200).json({'message':"Wrong Password"});
            }
        }
        else{
            console.log("User not found")
            res.status(400).json({'message':"User not found"});
        }
    })
    .catch((err)=>{
        console.log(err,"LogIN - failed");
        console.log(RollNumber,"LogIN - failed");
        res.status(400).json({'message':'Please try Again Later'});
    })
})

const delete_user = (RollNumber) => {
    turso.execute({
        sql: `DELETE FROM Student_Data WHERE RollNumber = :rollNo;`,
        args: { rollNo: RollNumber }
    })
    .then((res)=>{
        console.log('Deleted - ',RollNumber);
    })
    .catch((err)=>{
        console.log(err.message);
    })
}

app.post('/register',(req,res)=>{
    const { RollNumber,Name,Department,leetcode,CodeChef,HackerRank,GfG,Password } = req.body;
    turso.execute({
        sql:`INSERT INTO Student_Data(RollNumber,Name,Department)
	            VALUES (:rollNo,:name,:dept) ;`,
                args:{rollNo:RollNumber,name:Name,dept:Department}
    })
        .then((respp)=>{
            console.log("student Added");
            turso.execute({
                sql:"INSERT INTO LeetCode(RollNumber,Username) VALUES(:roll,:leetcode);",
                args:{roll:RollNumber,leetcode:leetcode.length===0?null:leetcode}
            })
            .then((res0)=>{
                console.log("Leetcode Username added");
                turso.execute({
                    sql:"INSERT INTO GeekForGeeks(RollNumber,Username) VALUES(:roll,:GfG);",
                    args:{roll:RollNumber,GfG:GfG.length===0?null:GfG}
                })
                .then((res1)=>{
                    console.log("CodeChef Username added");
                    turso.execute({
                        sql:"INSERT INTO CodeChef(RollNumber,Username) VALUES(:roll,:CodeChef);",
                        args:{roll:RollNumber,CodeChef:CodeChef.length===0?null:CodeChef}
                    })
                    .then((res2)=>{
                        console.log("HackerRank Username added");
                        turso.execute({
                            sql:"INSERT INTO HackerRank(RollNumber,Username) VALUES(:roll,:HackerRank);",
                            args:{roll:RollNumber,HackerRank:HackerRank.length===0?null:HackerRank}
                        })
                        .then((res3)=>{
                            console.log("Leetcode Username added");
                            turso.execute(
                                `
                                    INSERT INTO Users (RollNumber, Password)
                                    VALUES  ('${RollNumber}', '${Password}');
                                `
                            )
                            .then((res001)=>{
                                console.log(RollNumber,'- Registration Completed');
                                res.status(200).json({'message':'OK'});
                            })
                            .catch((err003)=>{
                                console.log(err003.message);
                                delete_user(RollNumber);
                                res.status(400).json({'message':'Failed to create an Account, ,Please retry.'});
                            })
                        })
                        .catch((er3)=>{
                            console.log(er3);
                            delete_user(RollNumber);
                            res.status(400).json({'message':'Failed to add HackerRank ,Please retry.'});
                        })                    })
                    .catch((er2)=>{
                        console.log(er2);
                        delete_user(RollNumber);
                        res.status(400).json({'message':'Failed to add CodeChef ,Please retry.'});
                    })                
                })
                .catch((er1)=>{
                    console.log(er1);
                    delete_user(RollNumber);
                    res.status(400).json({'message':'Failed to add GeekforGeeks ,Please retry.'});
                })
            })
            .catch((er0)=>{
                console.log(er0);
                delete_user(RollNumber);
                res.status(400).json({'message':'Failed to add LeetCode ,Please retry.'});
            })
        })
        .catch((er)=>{
            console.log(er);
            res.status(400).json(er.message);
        })
})

app.listen(4300, () => {
    console.log("Server running on port", 4300);
});
