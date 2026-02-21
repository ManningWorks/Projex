import type { FolioProject } from '../../types';
declare function ProjectView({ project, onBack, children }: {
    project: FolioProject;
    onBack?: () => void;
    children: React.ReactNode;
}): any;
declare namespace ProjectView {
    var Section: ({ project, name }: {
        project: FolioProject;
        name: string;
    }) => any;
    var Links: ({ project }: {
        project: FolioProject;
    }) => any;
}
export { ProjectView };
//# sourceMappingURL=ProjectView.d.ts.map