<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.keyword" placeholder="关键字"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getEmployees">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="employees" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60" label="#">
            </el-table-column>
            <el-table-column prop="username" label="用户名" width="90" sortable>
            </el-table-column>
            <el-table-column prop="password" label="密码" width="270" sortable>
            </el-table-column>
            <el-table-column prop="email" label="邮箱" width="180" sortable>
            </el-table-column>
            <el-table-column prop="headImage" label="头像" width="80" sortable>
                <template scope="scope">
                    <img :src="'http://localhost'+scope.row.headImage" height="50"/>
                </template>
            </el-table-column>
            <el-table-column prop="age" label="年龄" min-width="80" sortable>
            </el-table-column>
            <el-table-column prop="department.name" label="部门" width="80" sortable>
            </el-table-column>
            <el-table-column label="操作" min-width="150">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--编辑界面-->
        <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="editForm.sex">
                        <el-radio class="radio" :label="1">男</el-radio>
                        <el-radio class="radio" :label="0">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="年龄">
                    <el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
                </el-form-item>
                <el-form-item label="生日">
                    <el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input type="textarea" v-model="editForm.addr"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增" :visible.sync="addFormVisible">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="头像">
                    <el-input v-model="addForm.headImage" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="年龄" prop="age">
                    <el-input v-model.number="addForm.age" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="部门">
                    <el-input v-model="addForm.department_id" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">保存</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    keyword: ''
                },
                employees: [],
                total: 0,
                page: 1,
                pageSize:10,
                listLoading: false,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    name: [
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ]
                },
                //编辑界面数据
                editForm: {
                    id: 0,
                    name: '',
                    sex: -1,
                    age: 0,
                    birth: '',
                    addr: ''
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    email:[
                        {type:"email",message:"请输入正确的邮箱地址",trigger:"blur"}
                    ],
                    age:[
                        {type:"integer",max:60,min:18,message:"请输入正确的年龄",trigger:"blur"}
                    ]
                },
                //新增界面数据
                addForm: {
                    username: '',
                    email: '',
                    headImage: '',
                    age: '',
                    department_id: ''
                }

            }
        },
        methods: {
            //性别显示转换
            formatSex: function (row, column) {
                return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getEmployees();
            },
            //获取员工列表
            getEmployees() {
                let para = {
                    pageNum: this.page,
                    pageSize: this.pageSize,
                    keyword: this.filters.keyword
                };
                this.listLoading = true;
                this.$http.post("/employee/page",para)
                    .then(res =>{
                        this.listLoading = false;
                        let {total,rows} = res.data;
                        this.total = total;
                        this.employees = rows;
                })
                //NProgress.start();
                /*getUserListPage(para).then((res) => {
                    this.total = res.data.total;
                    this.employees = res.data.employees;
                    this.listLoading = false;
                    //NProgress.done();
                });*/
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    this.$http.delete("/employee/"+row.id)
                        .then(res=>{

                            this.listLoading = false;

                            let {success,message} = res.data;
                            if (success){
                                this.$message({
                                    message:message ,
                                    type: 'success'
                                });
                                this.getEmployees();
                            }else{
                                this.$message({
                                    message: message,
                                    type: 'error'
                                });
                            }
                        })
                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
            },
            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                //重置表单
                this.addForm={
                    username: '',
                    email: '',
                    headImage: '',
                    age: '',
                    department_id: ''
                };
            },
            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.editForm);
                            para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                            editUser(para).then((res) => {
                                this.editLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getEmployees();
                            });
                        });
                    }
                });
            },
            //新增
            addSubmit: function () {
                //验证表单
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认保存吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let para = Object.assign({}, this.addForm);
                            this.$http.post("/employee",para)
                                .then(res=>{
                                    this.listLoading = false;

                                    let {success,message} = res.data;
                                    if (success){
                                        this.$message({
                                            message:message ,
                                            type: 'success'
                                        });
                                        this.addFormVisible = false;
                                        this.getEmployees();
                                    }else{
                                        this.$message({
                                            message: message,
                                            type: 'error'
                                        });
                                    }
                                })

                        });
                    }
                });
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            //批量删除
            batchRemove: function () {
                var ids = this.sels.map(item => item.id).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = { ids: ids };
                    batchRemoveUser(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getEmployees();
                    });
                }).catch(() => {

                });
            }
        },
        mounted() {
            this.getEmployees();
        }
    }

</script>

<style scoped>

</style>