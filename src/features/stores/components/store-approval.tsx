import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Store } from '../types';
import { Badge } from '@/components/ui/badge';

interface StoreApprovalProps {
  store: Store;
  onApprove: (id: string, comments?: string) => void;
  onReject: (id: string, reason: string) => void;
}

export const StoreApproval: React.FC<StoreApprovalProps> = ({ 
  store, 
  onApprove, 
  onReject 
}) => {
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false);
  const [comments, setComments] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprove = () => {
    onApprove(store.id, comments);
    setIsApprovalDialogOpen(false);
    setComments('');
  };

  const handleReject = () => {
    onReject(store.id, rejectionReason);
    setIsRejectionDialogOpen(false);
    setRejectionReason('');
  };

  return (
    <div className="store-approval-container">
      <div className="flex items-center space-x-4">
        <Badge 
          variant={
            store.status === 'PENDING_APPROVAL' 
              ? 'warning' 
              : store.status === 'ACTIVE' 
                ? 'success' 
                : 'destructive'
          }
        >
          {store.status}
        </Badge>

        {store.status === 'PENDING_APPROVAL' && (
          <div className="flex space-x-2">
            <Button 
              variant="default" 
              onClick={() => setIsApprovalDialogOpen(true)}
            >
              Approve Store
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => setIsRejectionDialogOpen(true)}
            >
              Reject Store
            </Button>
          </div>
        )}
      </div>

      <Dialog 
        open={isApprovalDialogOpen} 
        onOpenChange={setIsApprovalDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Store</DialogTitle>
            <DialogDescription>
              Review and confirm store approval for {store.name}
            </DialogDescription>
          </DialogHeader>
          <Textarea 
            placeholder="Optional approval comments" 
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
          <Button onClick={handleApprove}>Confirm Approval</Button>
        </DialogContent>
      </Dialog>

      <Dialog 
        open={isRejectionDialogOpen} 
        onOpenChange={setIsRejectionDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Store</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting store {store.name}
            </DialogDescription>
          </DialogHeader>
          <Textarea 
            placeholder="Reason for rejection" 
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
          <Button variant="destructive" onClick={handleReject}>
            Confirm Rejection
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};