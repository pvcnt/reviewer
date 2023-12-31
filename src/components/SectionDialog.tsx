import { Button, Checkbox, Dialog, DialogBody, DialogFooter, FormGroup, InputGroup, Intent, TextArea } from "@blueprintjs/core";
import { useState } from "react";
import { Section } from "../config";
import ConfirmDialog from "./ConfirmDialog";


export type Props = {
    section: Section,
    title: string,
    isOpen: boolean,
    isDeleteButtonShown?: boolean;
    onClose: () => void,
    onSubmit: (value: Section) => void,
    onDelete?: () => void,
}

export default function SectionDialog({title, section, isOpen, isDeleteButtonShown = false, onClose, onSubmit, onDelete}: Props) {    
    const [label, setLabel] = useState(section.label)
    const [search, setSearch] = useState(section.search)
    const [notified, setNotified] = useState(section.notified)
    const [isDeleting, setDeleting] = useState(false)

    const handleOpening = () => {
        setLabel(section.label)
        setSearch(section.search)
        setNotified(section.notified)
    }
    const handleSubmit = () => {
        if (isValid()) {
            onSubmit({label, search, notified})
            onClose()
        }
    }
    const handleDelete = () => {
        if (onDelete !== undefined) {
            onDelete()
        }
        onClose()
    }
    const isValid = () => label.trim().length > 0 && search.trim().length > 0

    return (
        <>
            <Dialog title={title} isOpen={isOpen} onClose={onClose} onOpening={handleOpening}>
                <DialogBody>
                    <FormGroup label="Label" labelInfo="(required)">
                        <InputGroup value={label} onChange={e => setLabel(e.target.value)} />
                    </FormGroup>
                    <FormGroup
                        label="Search query"
                        labelInfo="(required)"
                        helperText={<a href="https://docs.github.com/en/search-github/searching-on-github/searching-issues-and-pull-requests" target="_blank">Documentation on search syntax</a>}
                    >
                        <TextArea value={search} onChange={e => setSearch(e.target.value)} className="w-full" />
                    </FormGroup>
                    <Checkbox checked={notified} label="Notify me about those pull requests" onChange={e => setNotified(e.currentTarget.checked)} />
                </DialogBody>
                <DialogFooter actions={
                    <>
                        <Button intent={Intent.PRIMARY} text="Submit" onClick={handleSubmit} disabled={!isValid()} />
                        <Button text="Cancel" onClick={onClose} />
                    </>
                }>
                    {isDeleteButtonShown && <Button intent={Intent.DANGER} text="Delete" minimal onClick={() => setDeleting(true)} />}
                </DialogFooter>
            </Dialog>

            <ConfirmDialog isOpen={isDeleting} onClose={() => setDeleting(false)} onConfirm={handleDelete}>
                Are you sure you want to delete section <em>{section.label}</em>?
            </ConfirmDialog>
        </>
    )
}