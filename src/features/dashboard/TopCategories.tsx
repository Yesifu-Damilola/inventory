"use client";

import { Card } from "@/components/ui/card";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { MOCK_TOP_CATEGORIES } from "@/components/constant/dashboard";
import { useQuery } from "@tanstack/react-query";
import { getDashboardTopCategoriesQueryOptions } from "@/query/queryOptions/dashboard/getDashboardTopCategories";

const TopCategories = () => {
    const { data: topCategoriesData, isPending, error } = useQuery(getDashboardTopCategoriesQueryOptions())
    console.log(topCategoriesData, "here are the top categories")


    return (
        <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
                Top Categories by Value
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[...MOCK_TOP_CATEGORIES]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#7c3aed" name="Value ($)" />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );
};

export default TopCategories;
