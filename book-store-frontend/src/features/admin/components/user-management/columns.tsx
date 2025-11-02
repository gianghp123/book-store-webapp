"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/features/users/dtos/response/user-response.dto";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone } from "lucide-react";
import { Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Role } from "@/lib/constants/enums";

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "fullName",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Mail className="h-4 w-4 text-gray-400" />
        {row.original.email}
      </div>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone",
    cell: ({ row }) => (
      row.original.phoneNumber && (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-gray-400" />
          {row.original.phoneNumber}
        </div>
      )
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role;
      let badgeColor = "";
      switch (role) {
        case Role.ADMIN:
          badgeColor = "bg-red-100 text-red-700";
          break;
        default:
          badgeColor = "bg-blue-100 text-blue-700";
          break;
      }
      
      return (
        <Badge className={badgeColor}>
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => (
      <div>
        {format(new Date(row.original.createdAt), 'MM/dd/yyyy')}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;
      
      return (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              // Handle edit action
              console.log("Edit user:", user);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              // Handle delete action
              console.log("Delete user:", user.id);
            }}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      );
    },
  },
];