<template>
    <div>
        <div>

        </div>
        <div>
            <el-table :data="tableData" stripe style="width: 100%">
                <el-table-column prop="date" label="Date" width="180" />
                <el-table-column prop="name" label="Name" width="180" />
                <el-table-column prop="address" label="Address" />
            </el-table>
        </div>
    </div>
</template>
<script>
export default {
    
}
</script>