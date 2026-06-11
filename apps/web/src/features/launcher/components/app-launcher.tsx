import { useStore } from '@tanstack/react-store';
import { APP_REGISTRY } from '../config/registry';
import { launcherStore, launcherActions } from '../stores/use-launcher-store';
import { Button } from '@kbm/ui';
import { Check, Download, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function AppLauncher() {
  const { installedApps } = useStore(launcherStore);

  // Group apps by category
  const categories = Object.values(APP_REGISTRY).reduce((acc, app) => {
    const cat = acc[app.category] || [];
    cat.push(app);
    acc[app.category] = cat;
    return acc;
  }, {} as Record<string, (typeof APP_REGISTRY)[string][]>);

  return (
    <div className="flex flex-col gap-8 p-6 lg:p-10 w-full max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">App Marketplace</h1>
        <p className="text-muted-foreground">
          Customize your workspace by installing only the modules you need.
        </p>
      </div>

      <div className="flex flex-col gap-10">
        {Object.entries(categories).map(([category, apps]) => (
          <div key={category} className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold border-b pb-2">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {apps.map((app) => {
                const isInstalled = installedApps.includes(app.id);
                const Icon = app.icon;

                return (
                  <div
                    key={app.id}
                    className="group flex flex-col justify-between gap-4 rounded-xl border bg-card p-6 text-card-foreground shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold leading-none tracking-tight">
                            {app.name}
                            {app.isCore && (
                              <span className="ml-2 inline-flex items-center rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-500">
                                Core
                              </span>
                            )}
                          </h3>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground min-h-[40px]">
                      {app.description}
                    </p>

                    <div className="flex items-center pt-4 border-t mt-auto">
                      {isInstalled ? (
                        app.isCore ? (
                          <div className="flex items-center text-sm font-medium text-muted-foreground">
                            <Check className="mr-2 h-4 w-4" />
                            System Installed
                          </div>
                        ) : (
                          <div className="flex w-full items-center justify-between">
                            <div className="flex items-center text-sm font-medium text-green-600 dark:text-green-500">
                              <Check className="mr-2 h-4 w-4" />
                              Installed
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => {
                                launcherActions.uninstallApp(app.id);
                                toast.success(`Uninstalled ${app.name}`);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove
                            </Button>
                          </div>
                        )
                      ) : (
                        <Button 
                          variant="secondary" 
                          className="w-full"
                          onClick={() => {
                            launcherActions.installApp(app.id);
                            toast.success(`Installed ${app.name}! You can now access it in the sidebar.`);
                          }}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Install App
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
