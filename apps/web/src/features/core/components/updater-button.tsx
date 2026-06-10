import { useState } from 'react';
import { isTauri } from '@tauri-apps/api/core';
import { check } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';
import { Button } from '@kbm/ui';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export function UpdaterButton() {
  const [isChecking, setIsChecking] = useState(false);

  async function checkForUpdates() {
    setIsChecking(true);
    try {
      const update = await check();

      if (update) {
        toast.info(`Found update ${update.version}`, {
          description: update.body || 'A new version is available.',
          action: {
            label: 'Install',
            onClick: async () => {
              const toastId = toast.loading('Downloading update...');
              try {
                let downloaded = 0;
                let contentLength = 0;
                await update.downloadAndInstall((event) => {
                  switch (event.event) {
                    case 'Started':
                      contentLength = event.data.contentLength || 0;
                      break;
                    case 'Progress':
                      downloaded += event.data.chunkLength;
                      break;
                    case 'Finished':
                      toast.success('Download complete! Relaunching...', { id: toastId });
                      break;
                  }
                });
                await relaunch();
              } catch (err) {
                toast.error('Failed to install update.', { id: toastId });
                console.error(err);
              }
            },
          },
        });
      } else {
        toast.success('You are on the latest version.');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Error checking for updates.');
    } finally {
      setIsChecking(false);
    }
  }

  if (!isTauri()) {
    return null;
  }

  return (
    <Button variant="outline" size="sm" onClick={checkForUpdates} disabled={isChecking}>
      <RefreshCw className={`w-4 h-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
      Check for Updates
    </Button>
  );
}
