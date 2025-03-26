import type { QueueType } from "~/repositories/queues-api";
import { Utensils, Users, Tag, Edit, Trash2, X } from "lucide-react";
import { useNavigate, useRevalidator } from "react-router";
import { useState } from "react";
import { useFetcher } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

export default function QueueTypeCard({ queueType }: { queueType: QueueType }) {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const validator = useRevalidator();
  const [editedData, setEditedData] = useState<QueueType>({ ...queueType });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleClick = () => {
    navigate(`/merchant/queue/${queueType.id}`);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setImageFile(file);
    } else {
      setPreviewImage(null);
      setImageFile(null);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("queue_id", queueType.id.toString());
    formData.append("_action", "editQueueType");

    // Handle image upload
    if (imageFile) {
      formData.append("image", imageFile);
    }

    fetcher.submit(formData, { method: "PATCH" });
    validator.revalidate();
  };

  return (
    <div
      className="z-30 flex flex-col bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg hover:scale-95 cursor-pointer transition duration-150 ease-in-out w-80 relative"
      role="button"
      tabIndex={0}
      onClick={handleClick}
    >
      {/* Image Section */}
      <div className="w-full flex justify-center mb-4">
        {queueType.image_url ? (
          <img
            src={queueType.image_url}
            alt={queueType.name}
            className="w-20 h-20 object-cover rounded-full border border-gray-300"
          />
        ) : (
          <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-full border border-gray-300">
            <Utensils className="w-10 h-10 text-gray-500" />
          </div>
        )}
      </div>

      {/* Queue Info */}
      <h2 className="text-lg font-semibold text-gray-800 text-center mb-2">
        {queueType.name}
      </h2>
      <p className="text-sm text-gray-500 text-center">
        {queueType.description}
      </p>

      {/* Status Badge */}
      <div className="flex justify-center mt-3">
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full ${
            queueType.is_available
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {queueType.is_available ? "Available" : "Unavailable"}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-600">
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-1 text-gray-500" />
          <span>{queueType.queue_counter} in queue</span>
        </div>
        <div className="flex items-center">
          <Tag className="w-4 h-4 mr-1 text-gray-500" />
          <span>Tag: {queueType.tag}</span>
        </div>
      </div>

      {/* Edit & Delete Buttons */}
      <div
        className="absolute top-4 right-4 flex gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Edit Dialog */}
        <Dialog
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setEditedData({ ...queueType });
              setPreviewImage(null);
              setImageFile(null);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-blue-500 hover:text-blue-700"
            >
              <Edit size={20} />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>แก้ไขประเภทคิว</DialogTitle>
            </DialogHeader>
            <fetcher.Form onSubmit={handleSubmit} className="grid gap-4 py-4">
              {/* Image Upload */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">
                  รูปภาพ
                </Label>
                <div className="col-span-3">
                  <Input
                    id="image"
                    type="file"
                    onChange={handleImageChange}
                    className="w-full"
                  />
                  {(previewImage || queueType.image_url) && (
                    <img
                      src={previewImage || queueType.image_url}
                      alt="Preview"
                      className="mt-2 w-20 h-20 object-cover rounded"
                    />
                  )}
                </div>
              </div>

              {/* Name */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  ชื่อ
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={editedData.name}
                  onChange={handleEditChange}
                  className="col-span-3"
                />
              </div>

              {/* Description */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  รายละเอียด
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={editedData.description}
                  onChange={handleEditChange}
                  className="col-span-3"
                />
              </div>

              {/* Tag */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tag" className="text-right">
                  แท็ก
                </Label>
                <Input
                  id="tag"
                  name="tag"
                  value={editedData.tag}
                  onChange={handleEditChange}
                  className="col-span-3"
                />
              </div>
              {/* Buttons */}
              <div className="flex justify-end space-x-2 mt-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    ยกเลิก
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button type="submit">บันทึก</Button>
                </DialogClose>
              </div>
            </fetcher.Form>
          </DialogContent>
        </Dialog>

        {/* Delete Alert Dialog */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={20} />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                คุณต้องการลบประเภทของคิวนี้ ใช่ไหม?
              </AlertDialogTitle>
              <AlertDialogDescription>
                คุณจะไม่สามารถย้อนกลับได้นะ!
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  const formData = new FormData();
                  formData.append("queue_id", queueType.id.toString());
                  formData.append("_action", "deleteQueueType");
                  fetcher.submit(formData, { method: "DELETE" });
                  validator.revalidate();
                }}
              >
                ลบ
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
